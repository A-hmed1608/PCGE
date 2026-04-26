# 📊 PCGE App (Plan Comptable Marocain)

Une application mobile moderne développée avec **React Native (Expo)** pour naviguer facilement dans le Plan Comptable Général des Entreprises (PCGE) Marocain.

## ✨ Fonctionnalités

- **Navigation Intuitive** : Parcourez les Classes, Rubriques et Postes comptables facilement.
- **Authentification Sécurisée** : Connexion via Email, Google, et Facebook propulsée par **Supabase**.
- **Mode Sombre** : Design premium et fluide avec prise en charge du Dark Mode (Aura background animation).
- **Interface Moderne** : UI/UX optimisée avec **NativeWind** (Tailwind CSS) pour des composants esthétiques et performants.
- **Gestion de Profil** : Possibilité de personnaliser son profil utilisateur (Photo, informations).

## 🛠️ Technologies Utilisées

- **Frontend** : [React Native](https://reactnative.dev/) avec le framework [Expo](https://expo.dev/)
- **Routage** : Expo Router (File-based routing)
- **Styling** : [NativeWind](https://www.nativewind.dev/) (Tailwind CSS v4)
- **Backend & Auth** : [Supabase](https://supabase.com/)
- **Langage** : TypeScript

## 🚀 Comment lancer le projet en local

1. **Cloner le repository** :
   ```bash
   git clone https://github.com/goku4442/PCGE.git
   cd PCGE
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Variables d'environnement** :
   Créez un fichier `.env` à la racine du projet et ajoutez vos clés Supabase et Google :
   ```env
   EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=votre_cle_google
   ```

4. **Démarrer l'application** :
   ```bash
   npm run dev
   ```

## 📱 Structure du Projet

- `/app` : Contient toutes les pages de l'application (Navigation par onglets, authentification, détails des classes comptables).
- `/components` : Composants UI réutilisables (Boutons, Cartes, etc.).
- `/constants` : Constantes globales comme les couleurs, la typographie, et le thème.
- `/context` : Fichiers de gestion d'état global (AuthContext, UserContext).
- `/data` : Données statiques JSON du Plan Comptable Marocain.
- `/hooks` : React hooks personnalisés.

## 📄 Licence

Ce projet est conçu pour aider les étudiants, les comptables et les professionnels de la finance au Maroc.
