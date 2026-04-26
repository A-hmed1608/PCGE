/// <reference types="nativewind/types" />
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useUser } from '../../context/UserContext';
import { PCGE_DATA } from '../../data/pcge_data';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const COLORS = {
  navy: '#1e3a8a', // blue-900
  deepBlue: '#172554', // blue-950/deep navy
  accentBlue: '#2563eb', // blue-600
  credit: '#0891b2', // cyan-600
  debit: '#991b1b', // red-800 (Bordeaux-ish)
  bg: '#f8fafc', // slate-50
  textPrimary: '#0f172a', // slate-900
  textSecondary: '#64748b', // slate-500
  white: '#ffffff',
  border: '#e2e8f0', // slate-200
};

// ─── Data ─────────────────────────────────────────────────────────────────────


// ─── Components ───────────────────────────────────────────────────────────────

function DashboardHeader() {
  const router = useRouter();
  const { profileImage } = useUser();
  const today = useMemo(() => new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), []);

  return (
    <View className="bg-blue-900 pt-12 pb-8 px-6 rounded-b-[40px] shadow-lg">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-white/70 text-sm font-medium">Tableau de Bord{'\n'}</Text>
          <Text className="text-white text-2xl font-bold">PCGE Maroc</Text>
        </View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => router.push('/profile')}
          className="w-12 h-12 rounded-full bg-white/10 items-center justify-center border-2 border-cyan-400 overflow-hidden"
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%' }} cachePolicy="none" />
          ) : (
            <Ionicons name="person" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
      
      <View className="bg-white/10 rounded-2xl p-4 border border-white/10">
        <View className="flex-row justify-between items-center">
          <Text className="text-white/80 font-medium">Date du jour</Text>
          <Ionicons name="calendar-outline" size={16} color="white" />
        </View>
        <Text className="text-white text-lg font-bold mt-1 capitalize">{today}</Text>
      </View>
    </View>
  );
}

function SectionTitle({ title, linkText }: { title: string; linkText?: string }) {
  return (
    <View className="flex-row justify-between items-center px-6 mt-8 mb-4">
      <Text className="text-slate-900 dark:text-white text-lg font-bold">{title}</Text>
      {linkText && (
        <TouchableOpacity>
          <Text className="text-blue-600 dark:text-cyan-400 font-semibold">{linkText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


function AccountCard({ item }: { item: any }) {
  const router = useRouter();
  return (
    <TouchableOpacity 
      onPress={() => router.push(`/class/${item.id}` as any)}
      activeOpacity={0.7}
      className="bg-white dark:bg-slate-800 mx-6 mb-4 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className="w-2.5 h-2.5 rounded-full bg-blue-900 dark:bg-cyan-400 mr-2" />
            <Text className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-widest uppercase">Classe {item.id}</Text>
          </View>
          <Text className="text-slate-900 dark:text-white text-xl font-black" numberOfLines={2}>{item.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

export default function Dashboard() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style="auto" />
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <DashboardHeader />


        {/* Main Indicators (Classes 1-5) */}
        <SectionTitle title="Comptabilité" linkText="Voir Tout" />
        {PCGE_DATA.classes.map(item => (
          <AccountCard key={item.id} item={item} />
        ))}

        {/* Bottom Banner */}
        <View className="mx-6 mt-4 p-6 bg-blue-900 rounded-3xl overflow-hidden relative">
          <View className="z-10">
            <Text className="text-white text-lg font-bold mb-1">Analyse Financière</Text>
            <Text className="text-white/70 text-sm mb-4">Générez vos bilans et rapports annuels en un clic.</Text>
            <TouchableOpacity className="bg-white self-start px-6 py-2 rounded-xl">
              <Text className="text-blue-900 font-bold">voir plus</Text>
            </TouchableOpacity>
          </View>
          <View className="absolute -right-6 -bottom-6 opacity-20">
            <MaterialCommunityIcons name="finance" size={140} color="white" />
          </View>
        </View>

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
          className="items-center"
        >
          <Ionicons name="grid" size={24} color={COLORS.navy} />
          <Text className="text-blue-900 text-[10px] font-bold mt-1">Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          className="items-center opacity-40"
        >
          <Ionicons name="person" size={24} color={COLORS.textSecondary} />
          <Text className="text-slate-500 text-[10px] font-bold mt-1">Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
