import { supabase } from '../lib/supabase';
import { Poem } from '../types';

export async function syncPoemsToCloud(localPoems: Poem[], userId: string) {
  try {
    // Convert local poems to cloud format
    const poemsToInsert = localPoems.map(poem => ({
      id: poem.id,
      user_id: userId,
      title: poem.title,
      content: poem.content,
      theme: poem.theme,
      created_at: poem.createdAt.toISOString(),
      feedback: poem.feedback ? JSON.stringify(poem.feedback) : null,
    }));

    const { error } = await supabase
      .from('poems')
      .upsert(poemsToInsert, { onConflict: 'id' });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error syncing poems to cloud:', error);
    return { success: false, error };
  }
}

export async function loadPoemsFromCloud(userId: string): Promise<Poem[]> {
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(poem => ({
      id: poem.id,
      title: poem.title,
      content: poem.content,
      theme: poem.theme,
      createdAt: new Date(poem.created_at),
      feedback: poem.feedback ? JSON.parse(poem.feedback) : undefined,
    }));
  } catch (error) {
    console.error('Error loading poems from cloud:', error);
    return [];
  }
}

export async function savePoemToCloud(poem: Poem, userId: string) {
  try {
    const { error } = await supabase
      .from('poems')
      .upsert({
        id: poem.id,
        user_id: userId,
        title: poem.title,
        content: poem.content,
        theme: poem.theme,
        created_at: poem.createdAt.toISOString(),
        feedback: poem.feedback ? JSON.stringify(poem.feedback) : null,
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving poem to cloud:', error);
    return { success: false, error };
  }
}