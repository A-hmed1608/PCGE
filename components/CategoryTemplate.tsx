import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CategoryItem {
  id: string;
  title: string;
}

interface CategoryTemplateProps {
  title: string;
  subtitle: string;
  items: CategoryItem[];
  nextRoute: (id: string) => string;
}

export default function CategoryTemplate({ title, subtitle, items, nextRoute }: CategoryTemplateProps) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Header */}
      <View className="bg-blue-900 pt-16 pb-12 px-8 rounded-b-[50px] shadow-xl">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20 mb-6"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xs font-bold tracking-widest uppercase opacity-70 mb-1">{subtitle}</Text>
        <Text className="text-white text-3xl font-black">{title}</Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id}
            onPress={() => router.push(nextRoute(item.id) as any)}
            activeOpacity={0.7}
            className="bg-white mb-4 p-6 rounded-3xl shadow-sm border border-slate-100 flex-row items-center"
          >
            <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center mr-4">
              <Text className="text-blue-900 font-black text-lg">{item.id}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 text-base font-bold" numberOfLines={2}>
                {item.title}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
