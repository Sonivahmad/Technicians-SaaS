import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useSpareParts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['spare_parts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spare_parts')
        .select('*')
        .order('part_name');
      if (error) throw error;
      return data;
    },
  });

  const addPart = useMutation({
    mutationFn: async (part: { part_name: string; price: number }) => {
      const { error } = await supabase.from('spare_parts').insert({ ...part, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['spare_parts'] }); toast.success('Part added!'); },
    onError: (e) => toast.error(e.message),
  });

  const updatePart = useMutation({
    mutationFn: async ({ id, ...part }: { id: string; part_name: string; price: number }) => {
      const { error } = await supabase.from('spare_parts').update(part).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['spare_parts'] }); toast.success('Part updated!'); },
    onError: (e) => toast.error(e.message),
  });

  const deletePart = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('spare_parts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['spare_parts'] }); toast.success('Part deleted!'); },
    onError: (e) => toast.error(e.message),
  });

  return { ...query, addPart, updatePart, deletePart };
};
