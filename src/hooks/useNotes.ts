
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useNotes = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          subjects (name)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (note: { title: string; content?: string; subject_id?: string; tags?: string[] }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...note,
          user_id: user.id,
          word_count: note.content ? note.content.split(' ').length : 0
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });
};
