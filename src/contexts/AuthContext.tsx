import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | DemoUser | null;
  loading: boolean;
  demoMode: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

const DEMO_USER: DemoUser = {
  uid: 'demo-user-001',
  email: 'demo@ibm-events.com',
  displayName: 'Demo User',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null);
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

  const login = async (email: string, password: string) => {
    if (demoMode) { setUser(DEMO_USER); return; }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    if (demoMode) { setUser({ ...DEMO_USER, email, displayName }); return; }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return cred;
  };

  const loginWithGoogle = async () => {
    if (demoMode) { setUser(DEMO_USER); return; }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (demoMode) { setUser(null); return; }
    return signOut(auth);
  };

  const loginAsDemo = () => {
    setDemoMode(true);
    setUser(DEMO_USER);
  };

  const value: AuthContextType = {
    user, loading, demoMode,
    login, signup, loginWithGoogle, loginAsDemo, logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
