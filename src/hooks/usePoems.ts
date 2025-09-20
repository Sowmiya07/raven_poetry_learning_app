import { useState, useEffect } from 'react';
import { Poem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';
import { syncPoemsToCloud, loadPoemsFromCloud, savePoemToCloud } from '../services/poemService';

export function usePoems() {
  const { user } = useAuth();
  const [localPoems, setLocalPoems] = useLocalStorage<Poem[]>('raven-poems', []);
  const [poems, setPoems] = useState<Poem[]>(localPoems);
  const [syncing, setSyncing] = useState(false);

  // Load poems when user signs in
  useEffect(() => {
    if (user) {
      loadCloudPoems();
    } else {
      setPoems(localPoems);
    }
  }, [user]);

  const loadCloudPoems = async () => {
    if (!user) return;
    
    setSyncing(true);
    try {
      const cloudPoems = await loadPoemsFromCloud(user.id);
      
      // Merge local and cloud poems, prioritizing cloud
      const mergedPoems = mergePoems(localPoems, cloudPoems);
      setPoems(mergedPoems);
      
      // Sync any local-only poems to cloud
      if (localPoems.length > 0) {
        await syncPoemsToCloud(localPoems, user.id);
      }
    } catch (error) {
      console.error('Error loading cloud poems:', error);
      setPoems(localPoems);
    } finally {
      setSyncing(false);
    }
  };

  const addPoem = async (poemData: Omit<Poem, 'id' | 'createdAt'>) => {
    const newPoem: Poem = {
      ...poemData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    // Update local state immediately
    const updatedPoems = [newPoem, ...poems];
    setPoems(updatedPoems);
    
    // Update local storage
    setLocalPoems(updatedPoems);

    // Save to cloud if user is signed in
    if (user) {
      await savePoemToCloud(newPoem, user.id);
    }

    return newPoem;
  };

  const updatePoem = async (updatedPoem: Poem) => {
    const updatedPoems = poems.map(poem => 
      poem.id === updatedPoem.id ? updatedPoem : poem
    );
    
    setPoems(updatedPoems);
    setLocalPoems(updatedPoems);

    if (user) {
      await savePoemToCloud(updatedPoem, user.id);
    }
  };

  return {
    poems,
    addPoem,
    updatePoem,
    syncing,
  };
}

function mergePoems(localPoems: Poem[], cloudPoems: Poem[]): Poem[] {
  const poemMap = new Map<string, Poem>();
  
  // Add local poems first
  localPoems.forEach(poem => {
    poemMap.set(poem.id, poem);
  });
  
  // Override with cloud poems (they take priority)
  cloudPoems.forEach(poem => {
    poemMap.set(poem.id, poem);
  });
  
  return Array.from(poemMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}