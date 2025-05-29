
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useStudySessions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['study-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          *,
          subjects (name)
        `)
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateStudySession = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (session: { title: string; description?: string; subject_id?: string; scheduled_date: string; start_time?: string; duration_hours?: number; session_type?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          ...session,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions', user?.id] });
    },
  });
};
