import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  user_type: 'shop' | 'customer';
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserIdFromProfile = async (user: User): Promise<number | null> => {
    console.log('[DEBUG] getUserIdFromProfile called with user:', user);
    let { data: userData, error: userError } = await supabase
      .from('user')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!userData || userError) {
      console.error('[DEBUG] getUserIdFromProfile: user not found by email', userError, userData);
      // Try by username (if available)
      if (user.user_metadata?.username) {
        const { data: userData2, error: userError2 } = await supabase
          .from('user')
          .select('id')
          .eq('username', user.user_metadata.username)
          .single();
        if (userData2 && !userError2) return userData2.id;
        if (userError2) console.error('[DEBUG] getUserIdFromProfile: user not found by username', userError2, userData2);
      }
      return null;
    }
    return userData?.id ?? null;
  };

  const fetchUserProfile = async (user: User) => {
    console.log('[DEBUG] fetchUserProfile called with user:', user);
    try {
      const userId = await getUserIdFromProfile(user);
      if (!userId) {
        console.error('[DEBUG] fetchUserProfile: No userId found');
        setProfile(null);
        return;
      }

      const { data: profileData, error } = await supabase
        .from('user')
        .select('id, email, username, first_name, last_name, user_type')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[DEBUG] Error fetching user profile:', error, profileData);
        setProfile(null);
      } else {
        console.log('[DEBUG] Profile data fetched:', profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('[DEBUG] Error in fetchUserProfile:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = '/welcome'; // Redirect after sign out
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && isMounted) {
        setUser(session.user);
        await fetchUserProfile(session.user);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user && isMounted) {
          setUser(session.user);
          await fetchUserProfile(session.user);
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        if (!user || !profile) {
          console.error('[DEBUG] Loading timeout: user or profile missing');
        }
      }
    }, 5000); // 5 seconds

    return () => clearTimeout(timeout);
  }, [loading, user, profile]);

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 