import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

interface UserContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profileImage, setProfileImageState] = useState<string | null>(null);
  const { colorScheme, setColorScheme } = useColorScheme();
  const { user } = useAuth();

  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    const loadProfileImage = async () => {
      // Clear image when logged out
      if (!user) {
        setProfileImageState(null);
        return;
      }
      
      const storageKey = `userProfileImage_${user.id}`;
      try {
        const savedImage = await AsyncStorage.getItem(storageKey);
        if (savedImage !== null) {
          setProfileImageState(savedImage);
        } else {
          setProfileImageState(null);
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };
    loadProfileImage();
  }, [user]);

  const setProfileImage = async (image: string | null) => {
    try {
      setProfileImageState(image);
      const storageKey = user ? `userProfileImage_${user.id}` : 'userProfileImage';
      if (image) {
        await AsyncStorage.setItem(storageKey, image);
      } else {
        await AsyncStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  const toggleDarkMode = () => {
    setColorScheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage, isDarkMode, toggleDarkMode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
