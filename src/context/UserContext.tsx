import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ImplementedWorkItem } from '../types/user';
import { profileService } from '../services/profileService';
import { postService } from '../services/postService';

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addImplementedCraft: (item: {
    originalReferenceTitle: string;
    originalReferenceSource: 'in_app' | 'youtube' | 'ai_generated';
    originalReferenceId: string;
    implementedCraftTitle: string;
    uploadedResultPhoto: string;
    feedbackNote?: string;
    creatorName?: string;
  }) => Promise<ImplementedWorkItem>;
  setMaterialsIHave: (materials: string[]) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const load = async () => {
    try {
      const u = await profileService.getCurrentUser();
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const refreshUser = async () => {
    await load();
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await profileService.updateUserProfile(data);
    setUser({ ...updated });
  };

  const addImplementedCraft = async (item: {
    originalReferenceTitle: string;
    originalReferenceSource: 'in_app' | 'youtube' | 'ai_generated';
    originalReferenceId: string;
    implementedCraftTitle: string;
    uploadedResultPhoto: string;
    feedbackNote?: string;
    creatorName?: string;
  }): Promise<ImplementedWorkItem> => {
    // If from in-app post, increment that post's implementation count
    if (item.originalReferenceSource === 'in_app' && item.originalReferenceId) {
      await postService.incrementImplementationCount(item.originalReferenceId);
    }

    const newItem = await profileService.addImplementedCraft(item);
    await load();
    return newItem;
  };

  const setMaterialsIHave = async (materials: string[]) => {
    const updated = await profileService.updateMaterialsIHave(materials);
    if (user) {
      setUser({ ...user, materialsIHave: updated });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        updateProfile,
        addImplementedCraft,
        setMaterialsIHave,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};
