import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics'; // <-- Fixes Error 2

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
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
