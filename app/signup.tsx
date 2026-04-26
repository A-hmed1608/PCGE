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
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = [
  { name: 'Maroc', code: 'MA', flag: '🇲🇦', dialCode: '+212' },
  { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33' },
  { name: 'Espagne', code: 'ES', flag: '🇪🇸', dialCode: '+34' },
  { name: 'Belgique', code: 'BE', flag: '🇧🇪', dialCode: '+32' },
  { name: 'Sénégal', code: 'SN', flag: '🇸🇳', dialCode: '+221' },
  { name: 'Côte d\'Ivoire', code: 'CI', flag: '🇨🇮', dialCode: '+225' },
  { name: 'Mauritanie', code: 'MR', flag: '🇲🇷', dialCode: '+222' },
  { name: 'Tunisie', code: 'TN', flag: '🇹🇳', dialCode: '+216' },
  { name: 'Algérie', code: 'DZ', flag: '🇩🇿', dialCode: '+213' },
  { name: 'États-Unis', code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', dialCode: '+1' },
  { name: 'Émirats Arabes Unis', code: 'AE', flag: '🇦🇪', dialCode: '+971' },
  { name: 'Arabie Saoudite', code: 'SA', flag: '🇸🇦', dialCode: '+966' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦', dialCode: '+974' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', dialCode: '+351' },
  { name: 'Italie', code: 'IT', flag: '🇮🇹', dialCode: '+39' },
  { name: 'Allemagne', code: 'DE', flag: '🇩🇪', dialCode: '+49' },
  { name: 'Royaume-Uni', code: 'GB', flag: '🇬🇧', dialCode: '+44' },
];

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Etudiant' | 'Professeur'>('Etudiant');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Password Strength Logic
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();
  const { signInWithGoogle, signInWithFacebook } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password || !phone) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (strength < 4) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
            phone: `${selectedCountry.dialCode}${phone}`,
          },
        },
      });

      if (signUpError) {
        // Show user-friendly messages for common errors
        if (signUpError.message.includes('Network') || signUpError.message.includes('fetch')) {
          setError('Problème de connexion. Vérifiez votre connexion internet et réessayez.');
        } else if (signUpError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé. Essayez de vous connecter.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // If a session was created automatically, log them out
      if (signUpData.session) {
        await supabase.auth.signOut();
      }

      // Clear all fields
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setRole('Etudiant');

      // Show success message and redirect
      Alert.alert(
        "Compte créé ✅",
        "Vérifiez votre email pour confirmer votre compte, puis connectez-vous.",
        [{ text: "Se connecter", onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
      setError('Problème de connexion. Vérifiez votre connexion internet et réessayez.');
      console.error('Erreur inscription:', err);
    } finally {
      // ✅ Loading ALWAYS resets — no matter what happened above
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Mini Header */}
      <View className="bg-blue-900 pt-16 pb-12 px-8 rounded-b-[50px] shadow-xl">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20 mb-6"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-black">Créer un{"\n"}Compte</Text>
        <Text className="text-blue-200 text-sm font-medium mt-2">Rejoignez l&apos;élite comptable du Maroc</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-8 pt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Error Message */}
          {error && (
            <View className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100 flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text className="text-red-600 text-xs font-bold ml-2 flex-1">{error}</Text>
            </View>
          )}

          {/* Form */}
          <View className="space-y-5">
            <View>
              <Text className="text-slate-500 text-[10px] font-bold uppercase ml-1 mb-2 tracking-widest">Nom Complet</Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                <Ionicons name="person-outline" size={20} color="#64748b" />
                <TextInput 
                  className="flex-1 ml-3 text-slate-900 font-semibold"
                  placeholder="Jean Dupont"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Role Selection */}
            <View className="mt-4">
              <Text className="text-slate-500 text-[10px] font-bold uppercase ml-1 mb-2 tracking-widest">Je suis</Text>
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => setRole('Etudiant')}
                  className={`flex-1 py-3 rounded-2xl items-center border ${role === 'Etudiant' ? 'bg-blue-900 border-blue-900' : 'bg-slate-50 border-slate-200'}`}
                >
                  <Text className={`font-bold ${role === 'Etudiant' ? 'text-white' : 'text-slate-500'}`}>Étudiant</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setRole('Professeur')}
                  className={`flex-1 py-3 rounded-2xl items-center border ${role === 'Professeur' ? 'bg-blue-900 border-blue-900' : 'bg-slate-50 border-slate-200'} ml-3`}
                >
                  <Text className={`font-bold ${role === 'Professeur' ? 'text-white' : 'text-slate-500'}`}>Professeur</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-slate-500 text-[10px] font-bold uppercase ml-1 mb-2 tracking-widest">Numéro de téléphone</Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-2 py-3">
                <TouchableOpacity 
                  onPress={() => setIsCountryPickerVisible(true)}
                  className="flex-row items-center bg-white border border-slate-100 rounded-xl px-2 py-1.5 ml-1"
                >
                  <Text className="text-lg">{selectedCountry.flag}</Text>
                  <Text className="text-slate-900 font-bold ml-1.5 text-xs">{selectedCountry.dialCode}</Text>
                  <Ionicons name="chevron-down" size={12} color="#64748b" className="ml-1" />
                </TouchableOpacity>
                <TextInput 
                  className="flex-1 ml-3 text-slate-900 font-semibold"
                  placeholder="6 XX XX XX XX"
                  placeholderTextColor="#94a3b8"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </View>


            <View className="mt-4">
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
              
              {/* Strength Meter Bar */}
              {password.length > 0 && (
                <View className="flex-row mt-2 h-1.5 space-x-1">
                  {[1, 2, 3, 4].map((step) => (
                    <View 
                      key={step}
                      className={`flex-1 rounded-full ${
                        step <= strength 
                          ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-orange-500' : strength === 3 ? 'bg-yellow-500' : 'bg-green-500')
                          : 'bg-slate-100'
                      }`}
                    />
                  ))}
                </View>
              )}
            </View>

          </View>

          {/* Signup Button */}
          <TouchableOpacity 
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
            className="bg-blue-900 mt-10 py-5 rounded-2xl shadow-lg shadow-blue-900/40 items-center justify-center flex-row"
          >
            {loading ? (
              <ActivityIndicator color="white" className="mr-2" />
            ) : (
              <Text className="text-white font-black text-lg">S&apos;inscrire</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mt-8">
            <View className="flex-1 h-[1px] bg-slate-100" />
            <Text className="text-slate-400 font-medium px-4 text-[10px] uppercase tracking-wider">ou s&apos;inscrire avec</Text>
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
              <Text className="text-white font-bold ml-2">S&apos;inscrire avec Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-10 items-center">
            <Text className="text-slate-500 font-medium">Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-blue-900 font-black">Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Picker Modal */}
      <Modal
        visible={isCountryPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCountryPickerVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setIsCountryPickerVisible(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <View 
            onStartShouldSetResponder={() => true}
            className="bg-white rounded-t-[40px] h-[80%] px-8 pt-8"
          >
            <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-8" />
            
            <Text className="text-slate-900 text-2xl font-black mb-6">Choisir un pays</Text>
            
            {/* Search Bar */}
            <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 mb-6">
              <Ionicons name="search-outline" size={20} color="#64748b" />
              <TextInput 
                className="flex-1 ml-3 text-slate-900 font-semibold"
                placeholder="Rechercher un pays..."
                placeholderTextColor="#94a3b8"
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoFocus={true}
              />
            </View>

            <FlatList
              data={COUNTRIES.filter(c => 
                c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
                c.dialCode.includes(countrySearch)
              )}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => {
                    setSelectedCountry(item);
                    setIsCountryPickerVisible(false);
                    setCountrySearch('');
                  }}
                  className="flex-row items-center py-4 border-b border-slate-50"
                >
                  <Text className="text-2xl">{item.flag}</Text>
                  <Text className="flex-1 ml-4 text-slate-900 font-bold">{item.name}</Text>
                  <Text className="text-slate-500 font-black">{item.dialCode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
