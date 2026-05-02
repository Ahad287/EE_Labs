import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics'; // <-- Fixes Error 2

const firebaseConfig = {
  apiKey: "AIzaSyDVowIqfwz9e4oIqcfo_aSLmyYOKNVwTQA",
  authDomain: "ee-labs.firebaseapp.com",
  projectId: "ee-labs",
  storageBucket: "ee-labs.firebasestorage.app",
  messagingSenderId: "704988993734",
  appId: "1:704988993734:web:8856d4d29640d121e7dfc7",
  measurementId: "G-DBG4JKMLYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (This fixes the getAnalytics error)
const analytics = getAnalytics(app);

// Initialize Auth and Provider (This fixes the 'auth' not found error)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Force Google to only show @bitmesra.ac.in accounts!
googleProvider.setCustomParameters({
  hd: 'bitmesra.ac.in'
});