import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  wasteTypes: string[];
  mainGoal: string;
  city?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  userId: string | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    return true;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name }, // stored in raw_user_meta_data, used by the DB trigger
      },
    });

    if (error || !authData.user) {
      console.error('Signup error:', error?.message);
      return false;
    }

    // Update the auto-created profile row with onboarding data
    await supabase.from('users').update({
      name: data.name,
      waste_types: data.wasteTypes,
      main_goal: data.mainGoal,
      city: data.city ?? '',
    }).eq('id', authData.user.id);

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const user: SupabaseUser | null = session?.user ?? null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        userEmail: user?.email ?? null,
        userName: user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? null,
        userId: user?.id ?? null,
        session,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
