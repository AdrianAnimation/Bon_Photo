import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.dashboard': 'Dashboard',
      'nav.about': 'About Us',
      
      // Upload Form
      'upload.photo': 'Photo',
      'upload.title': 'Title',
      'upload.description': 'Description',
      'upload.altText': 'Alt Text',
      'upload.altTextPlaceholder': 'Describe the image for accessibility',
      'upload.category': 'Category',
      'upload.selectCategory': 'Select a category',
      'upload.status': 'Status',
      'upload.public': 'Public',
      'upload.private': 'Private',
      'upload.submit': 'Upload Photo',
      
      // Search
      'search.placeholder': 'Search for photos...',
      'search.button': 'Search',
      'search.noResults': 'No results found.',
      'search.error': 'Search failed. Please try again.',
      
      // Auth
      'auth.loginTitle': 'Login',
      'auth.registerTitle': 'Register',
      'auth.username': 'Username',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.login': 'Connexion',
      'nav.register': 'Inscription',
      'nav.dashboard': 'Tableau de Bord',
      'nav.about': 'À Propos',
      
      // Upload Form
      'upload.photo': 'Photo',
      'upload.title': 'Titre',
      'upload.description': 'Description',
      'upload.altText': 'Texte Alternatif',
      'upload.altTextPlaceholder': 'Décrivez l\'image pour l\'accessibilité',
      'upload.category': 'Catégorie',
      'upload.selectCategory': 'Sélectionnez une catégorie',
      'upload.status': 'Statut',
      'upload.public': 'Public',
      'upload.private': 'Privé',
      'upload.submit': 'Télécharger la Photo',
      
      // Search
      'search.placeholder': 'Rechercher des photos...',
      'search.button': 'Rechercher',
      'search.noResults': 'Aucun résultat trouvé.',
      'search.error': 'La recherche a échoué. Veuillez réessayer.',
      
      // Auth
      'auth.loginTitle': 'Connexion',
      'auth.registerTitle': 'Inscription',
      'auth.username': 'Nom d\'utilisateur',
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.confirmPassword': 'Confirmer le mot de passe',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
