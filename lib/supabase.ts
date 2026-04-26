import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// ── Startup check: catch missing env vars early ───────────────────────────────
if (__DEV__) {
  if (!supabaseUrl) console.error('[Supabase] ❌ EXPO_PUBLIC_SUPABASE_URL is missing!');
  if (!supabaseAnonKey) console.error('[Supabase] ❌ EXPO_PUBLIC_SUPABASE_ANON_KEY is missing!');
  console.log('[Supabase] ✅ URL:', supabaseUrl.slice(0, 30) + '...');
}

const ExpoStorageAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') return null;
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') return;
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') return;
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // We handle URL parsing manually
    flowType: 'pkce',          // Explicit: PKCE returns ?code= not #access_token=
  },
});
