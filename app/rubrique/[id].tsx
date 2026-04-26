/// <reference types="nativewind/types" />
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { PCGE_DATA } from '../../data/pcge_data';

export default function RubriqueDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const currentRubrique = PCGE_DATA.rubriques.find(r => r.id === id);
  
  const filteredPostes = useMemo(() => {
    return PCGE_DATA.postes.filter(p => 
      p.rubriqueId === id && 
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery))
    );
  }, [id, searchQuery]);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style="auto" />
      
      <View className="bg-blue-900 pt-16 pb-8 px-6 rounded-b-[40px] shadow-xl">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20 mr-4"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white/70 text-[10px] font-bold tracking-widest uppercase">Rubrique {id}</Text>
            <Text className="text-white text-xl font-black" numberOfLines={1}>
              {currentRubrique?.title || 'Rubrique non trouvée'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center bg-white/10 rounded-2xl px-4 py-3 border border-white/20">
          <Ionicons name="search" size={20} color="white" />
          <TextInput 
            className="flex-1 ml-3 text-white font-semibold"
            placeholder="Rechercher un poste..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="flex-1 pt-4">
        <FlashList
          data={filteredPostes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={() => (
            <View className="items-center justify-center pt-20">
              <Ionicons name="search-outline" size={60} color="#cbd5e1" />
              <Text className="text-slate-400 dark:text-slate-500 font-bold mt-4">Aucun poste trouvé</Text>
            </View>
          )}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => router.push(`/poste/${item.id}` as any)}
              className="bg-white dark:bg-slate-800 mb-3 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex-row items-center"
            >
              <View className="w-14 h-14 bg-blue-50 dark:bg-blue-900/40 rounded-xl items-center justify-center mr-4">
                <Text className="text-blue-900 dark:text-cyan-400 font-black text-sm">{item.id}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-tight py-1" numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
              <View className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 items-center justify-center">
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
