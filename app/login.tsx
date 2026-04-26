import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle, signInWithFacebook } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Network') || error.message.includes('fetch')) {
          setError('Problème de connexion. Vérifiez votre connexion internet et réessayez.');
        } else if (error.message.includes('Invalid login')) {
          setError('Email ou mot de passe incorrect.');
        } else {
          setError(error.message);
        }
      }
      // Success is handled by the AuthProvider listener in _layout.tsx
    } catch (err: any) {
      setError('Problème de connexion. Vérifiez votre connexion internet et réessayez.');
      console.error('Erreur connexion:', err);
    } finally {
      // ✅ Loading ALWAYS resets — even on network crash
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Header / Branding */}
      <View className="bg-blue-900 pt-20 pb-16 px-8 rounded-b-[60px] shadow-2xl items-center justify-center">
        <View className="w-20 h-20 bg-white/10 rounded-3xl items-center justify-center border border-white/20 mb-6">
          <Ionicons name="briefcase" size={40} color="white" />
        </View>
        <Text className="text-white text-3xl font-black text-center">PCGE Maroc</Text>
        <Text className="text-blue-200 text-sm font-medium mt-2">Solutions de Comptabilité Digitale</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-8 pt-10"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="mb-8">
            <Text className="text-slate-900 text-2xl font-black">Bienvenue</Text>
            <Text className="text-slate-500 font-medium mt-1">Connectez-vous pour continuer</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100 flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text className="text-red-600 text-xs font-bold ml-2 flex-1">{error}</Text>
            </View>
          )}

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-slate-500 text-[10px] font-bold uppercase ml-1 mb-2 tracking-widest">Email</Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                <Ionicons name="mail-outline" size={20} color="#64748b" />
                <TextInput 
                  className="flex-1 ml-3 text-slate-900 font-semibold"
                  placeholder="votre@email.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-slate-500 text-[10px] font-bold uppercase ml-1 mb-2 tracking-widest">Mot de passe</Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                <TextInput 
                  className="flex-1 ml-3 text-slate-900 font-semibold"
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity className="mt-4 self-end">
            <Text className="text-blue-600 font-bold text-xs">Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
            className={`bg-blue-900 mt-10 py-5 rounded-2xl shadow-lg shadow-blue-900/40 items-center justify-center flex-row`}
          >
            {loading ? (
              <ActivityIndicator color="white" className="mr-2" />
            ) : (
              <Text className="text-white font-black text-lg">Connexion</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mt-8">
            <View className="flex-1 h-[1px] bg-slate-100" />
            <Text className="text-slate-400 font-medium px-4 text-[10px] uppercase tracking-wider">ou continuer avec</Text>
            <View className="flex-1 h-[1px] bg-slate-100" />
          </View>

          {/* Social Sign In Buttons */}
          <View className="mt-6">
            {/* Facebook */}
            <TouchableOpacity 
              onPress={async () => {
                setLoading(true);
                try {
                  await signInWithFacebook();
                } catch (err: any) {
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              activeOpacity={0.8}
              className="w-full py-4 rounded-2xl border items-center justify-center flex-row shadow-sm"
              style={{ backgroundColor: '#1877F2', borderColor: '#1877F2' }}
            >
              <Ionicons name="logo-facebook" size={20} color="#ffffff" />
              <Text className="text-white font-bold ml-2">Se connecter avec Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-10 items-center">
            <Text className="text-slate-500 font-medium">Vous n&apos;avez pas de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text className="text-blue-600 font-black">S&apos;inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
