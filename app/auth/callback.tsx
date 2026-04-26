import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';

/**
 * Catches the OAuth deep link: pcge://auth/callback?code=xxx
 *
 * This screen does ONE thing: exchange the PKCE code for a session (cold-start
 * scenario only — warm-start already handled in signInWithFacebook).
 *
 * ALL navigation decisions are made by the guard in app/_layout.tsx, which
 * watches the session and redirects to /(tabs) once it's set.
 * This screen never calls router.replace() itself.
 */
export default function AuthCallbackScreen() {
  useEffect(() => {
    const tryExchangeCode = async () => {
      const url = await Linking.getInitialURL();
      if (!url || !url.includes('auth/callback')) return;

      // Check if session already exists (warm-start: signInWithFacebook already ran)
      const { data } = await supabase.auth.getSession();
      if (data.session) return; // already authenticated — _layout.tsx will redirect

      const parsed = new URL(url);
      const code = parsed.searchParams.get('code');
      if (!code) return;

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('[AuthCallback] exchangeCodeForSession error:', error.message);
      }
      // onAuthStateChange fires → AuthContext.session updates →
      // _layout.tsx guard detects session on 'auth' segment → redirects to /(tabs)
    };

    tryExchangeCode();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-blue-900">
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="text-white/60 text-sm mt-4 font-medium">
        Connexion en cours…
      </Text>
    </View>
  );
}
