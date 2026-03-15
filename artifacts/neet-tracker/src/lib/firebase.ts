import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCyTh9vhsiSot55IMYr-POZGULz1l9yyVk",
  authDomain: "neet-tracker-50df5.firebaseapp.com",
  databaseURL: "https://neet-tracker-50df5-default-rtdb.firebaseio.com",
  projectId: "neet-tracker-50df5",
  storageBucket: "neet-tracker-50df5.firebasestorage.app",
  messagingSenderId: "182776849774",
  appId: "1:182776849774:web:ec0576c5bc12b43fc3cd7f",
  measurementId: "G-3T3RR55V6T",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
