import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Demo user for offline/demo mode
const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@ibm-events.com',
  displayName: 'Demo User',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Firebase auth not available, running in demo mode');
      setDemoMode(true);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (demoMode) {
      setUser(DEMO_USER);
      return;
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, displayName) => {
    if (demoMode) {
      setUser({ ...DEMO_USER, email, displayName });
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return cred;
  };

  const loginWithGoogle = async () => {
    if (demoMode) {
      setUser(DEMO_USER);
      return;
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (demoMode) {
      setUser(null);
      return;
    }
    return signOut(auth);
  };

  const loginAsDemo = () => {
    setDemoMode(true);
    setUser(DEMO_USER);
  };

  const value = {
    user,
    loading,
    demoMode,
    login,
    signup,
    loginWithGoogle,
    loginAsDemo,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
