import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB9Tj46YIrq7eb4gbXL7x8P2WUCsXQM8nA",
  authDomain: "ibm-event-manager.firebaseapp.com",
  projectId: "ibm-event-manager",
  storageBucket: "ibm-event-manager.firebasestorage.app",
  messagingSenderId: "315424915270",
  appId: "1:315424915270:web:e0801d77e3ceadfee6af47",
  measurementId: "G-SCQ52HVLHK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
