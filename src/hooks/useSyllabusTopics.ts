
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSyllabusTopics = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['syllabus-topics', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('syllabus_topics')
        .select(`
          *,
          subjects (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUpdateTopicCompletion = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ topicId, completed }: { topicId: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('syllabus_topics')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', topicId)
        .eq('user_id', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabus-topics', user?.id] });
    },
  });
};
