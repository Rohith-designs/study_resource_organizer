
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useStudyResources = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['study-resources', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('study_resources')
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

export const useCreateStudyResource = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (resource: { name: string; type: string; subject_id?: string; external_url?: string; tags?: string[] }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('study_resources')
        .insert({
          ...resource,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-resources', user?.id] });
    },
  });
};
