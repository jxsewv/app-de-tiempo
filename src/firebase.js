import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCxo8X-tac8c4pwidbz_Og_rPg-k1-bUpQ",
  authDomain: "app-tiempo-c7eb4.firebaseapp.com",
  databaseURL: "https://app-tiempo-c7eb4-default-rtdb.firebaseio.com",
  projectId: "app-tiempo-c7eb4",
  storageBucket: "app-tiempo-c7eb4.firebasestorage.app",
  messagingSenderId: "636988849665",
  appId: "1:636988849665:web:9b1218ecc51351b7894a08"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);