import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const COLORS = {
  navy: '#1e3a8a', // blue-900
  accentBlue: '#2563eb', // blue-600
  bg: '#f8fafc', // slate-50
  white: '#ffffff',
  textPrimary: '#0f172a', // slate-900
  textSecondary: '#64748b', // slate-500
  border: '#e2e8f0', // slate-200
  red: '#991b1b', // red-800 Bordeaux
  teal: '#0891b2', // cyan-600
};

// Dynamic profile info will be loaded from Supabase Auth
// ─── Components ───────────────────────────────────────────────────────────────

function ProfileHeader({ image, onPickImage, name, role }: { image: string | null; onPickImage: () => void; name: string; role: string }) {
  const router = useRouter();
  return (
    <View className="bg-blue-900 pt-12 pb-12 px-6 rounded-b-[40px] shadow-lg items-center">
      <View className="flex-row justify-between w-full items-center mb-6">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Mon Profil</Text>
        <View className="w-10 h-10" />
      </View>

      <View className="relative">
        <View className="w-24 h-24 rounded-full bg-white/10 items-center justify-center border-4 border-cyan-400 overflow-hidden">
          {image ? (
            <Image 
              source={{ uri: image }} 
              style={{ width: '100%', height: '100%' }} 
              cachePolicy="none"
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Ionicons name="person" size={50} color="white" />
          )}
        </View>
        <TouchableOpacity 
          onPress={onPickImage}
          activeOpacity={0.8}
          className="absolute bottom-0 right-0 bg-cyan-500 w-8 h-8 rounded-full items-center justify-center border-2 border-blue-900"
        >
          <Ionicons name="camera" size={16} color="white" />
        </TouchableOpacity>
      </View>
      <Text className="text-white text-2xl font-black mt-4">{name}</Text>
    </View>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="px-6 mt-8">
      <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold tracking-widest uppercase mb-3 ml-2">{title}</Text>
      <View className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
        {children}
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value, isLast = false }: any) {
  return (
    <View className={`flex-row items-center p-4 ${!isLast ? 'border-b border-slate-50 dark:border-white/5' : ''}`}>
      <View className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
        <Ionicons name={icon} size={20} color={COLORS.navy} />
      </View>
      <View className="flex-1">
        <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase">{label}</Text>
        <Text className="text-slate-900 dark:text-white text-sm font-semibold">{value}</Text>
      </View>
    </View>
  );
}

function SettingsRow({ icon, label, isToggle, value, isLast = false, onToggle }: any) {
  return (
    <View className={`flex-row items-center p-4 ${!isLast ? 'border-b border-slate-50 dark:border-white/5' : ''}`}>
      <View className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
        <Ionicons name={icon} size={20} color={COLORS.navy} />
      </View>
      <Text className="flex-1 text-slate-700 dark:text-slate-200 font-semibold">{label}</Text>
      {isToggle ? (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
          thumbColor="white"
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
      )}
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const [notifs, setNotifs] = useState(true);
  const { profileImage, setProfileImage, isDarkMode, toggleDarkMode } = useUser();
  const { user, signOut } = useAuth();

  const profileInfo = {
    name: user?.user_metadata?.full_name || 'Utilisateur',
    role: user?.user_metadata?.role || 'Déconnecté(e)',
    email: user?.email || 'email@inconnu.com',
    phone: user?.user_metadata?.phone || 'Non renseigné',
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Requises',
          'Veuillez autoriser l\'accès à votre galerie pour changer votre photo de profil.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true, // This can cause NoSuchMethodError on some old Android versions/builds
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la sélection de l\'image.'
      );
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style="auto" />
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ProfileHeader image={profileImage} onPickImage={pickImage} name={profileInfo.name} role={profileInfo.role} />

        <ProfileSection title="Informations Professionnelles">
          <InfoRow icon="mail-outline" label="Email" value={profileInfo.email} />
          <InfoRow icon="call-outline" label="Téléphone" value={profileInfo.phone} isLast />
        </ProfileSection>

        <ProfileSection title="Préférences">
          <SettingsRow icon="notifications-outline" label="Notifications" isToggle value={notifs} onToggle={setNotifs} />
          <SettingsRow 
            icon="color-palette-outline" 
            label="Mode Sombre" 
            isToggle 
            value={isDarkMode} 
            onToggle={toggleDarkMode} 
          />
          <SettingsRow icon="help-circle-outline" label="Aide & Support" isLast />
        </ProfileSection>

        <TouchableOpacity 
          onPress={signOut}
          className="mx-6 mt-8 flex-row items-center justify-center bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30"
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
          <Text className="text-red-800 dark:text-red-400 font-bold ml-2">Se Déconnecter</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Floating Bottom Nav */}
      <View 
        className="absolute bottom-6 left-6 right-6 bg-white dark:bg-slate-800 flex-row items-center justify-around py-4 px-2 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        <TouchableOpacity 
          // @ts-ignore
          onPress={() => router.replace('/')}
          className="items-center opacity-40"
        >
          <Ionicons name="grid" size={24} color={COLORS.textSecondary} />
          <Text className="text-slate-500 text-[10px] font-bold mt-1">Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          className="items-center"
        >
          <Ionicons name="person" size={24} color={COLORS.navy} />
          <Text className="text-blue-900 text-[10px] font-bold mt-1">Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
