import 'react-native-url-polyfill/auto';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { UserProvider } from '../context/UserContext';
import BrandedLoading from '../components/BrandedLoading';
import { AuthProvider, useAuth } from '../context/AuthContext';
import '../global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const splashHidden = useRef(false);

  // Safety net: force hide splash screen after 6 seconds max
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (!splashHidden.current) {
        splashHidden.current = true;
        SplashScreen.hideAsync().catch(() => {});
      }
    }, 6000);
    return () => clearTimeout(safetyTimeout);
  }, []);

  // Session guard: redirect based on auth state
  useEffect(() => {
    if (loading) return;

    // Hide splash screen once loading is complete
    if (!splashHidden.current) {
      splashHidden.current = true;
      SplashScreen.hideAsync().catch(() => {});
    }

    const segment = segments[0] as string;

    // These routes are accessible without a session
    const isPublicRoute =
      segment === 'login' ||
      segment === 'signup' ||
      segment === 'auth';

    if (!session && !isPublicRoute) {
      router.replace('/login');
    } else if (session && (segment === 'login' || segment === 'signup' || segment === 'auth')) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return <BrandedLoading />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="signup" options={{ animation: 'fade' }} />
      <Stack.Screen name="auth" options={{ animation: 'none' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </UserProvider>
    </AuthProvider>
  );
}
