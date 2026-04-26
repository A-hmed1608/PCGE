import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Alert } from 'react-native';

// Required on Android: closes the auth browser tab after redirect
WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  scopes: ['profile', 'email'],
});

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ── Restore session with a 5-second timeout ─────────────────────────────
    // Prevents the splash screen from hanging forever if the network is slow.
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch((err) => {
        console.error('Erreur restauration session:', err);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    // Handles session updates from ALL sources:
    // email/password, Google, Facebook, deep link returns, token refresh, etc.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();

      // Force account selection by signing out locally first
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore if already signed out
      }

      const response = await GoogleSignin.signIn();
      const idToken = response?.data?.idToken || (response as any)?.idToken;

      if (idToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });
        if (error) throw new Error(error.message);
      } else {
        throw new Error('Aucun token Google obtenu.');
      }
    } catch (error: any) {
      // ✅ Always reset loading — whether cancelled or error
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled — silent return, no error shown
        return;
      }
      const errorMessage = error.message || 'Une erreur inconnue est survenue avec Google.';
      console.error('Détail Erreur Google:', error);
      throw new Error(errorMessage);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);

      // ── Step 1: Build the redirect URI ────────────────────────────────────
      const redirectUri = makeRedirectUri({
        scheme: 'pcge',
        path: 'auth/callback',
      });

      // ── Step 2: Get the OAuth URL from Supabase ───────────────────────────
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw new Error(error.message);
      if (!data?.url) throw new Error('Aucune URL OAuth Facebook obtenue.');

      // ── Step 3: Open the Facebook login page ─────────────────────────────
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

      if (result.type !== 'success' || !result.url) {
        // ✅ User cancelled — reset loading and return silently
        setLoading(false);
        return;
      }

      // ── Step 4: Exchange the PKCE auth code for a session ────────────────
      const url = new URL(result.url);
      const code = url.searchParams.get('code');

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw new Error(exchangeError.message);
        // ✅ onAuthStateChange fires → loading set to false automatically
      } else {
        throw new Error('Code PKCE Facebook non reçu dans la réponse.');
      }
    } catch (error: any) {
      // ✅ Always reset loading on error
      setLoading(false);
      const errorMessage = error.message || 'Une erreur inconnue est survenue avec Facebook.';
      console.error('Détail Erreur Facebook:', error);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, signInWithGoogle, signInWithFacebook }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
