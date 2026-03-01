import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useServicePresets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['service_presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_presets')
        .select('*')
        .order('preset_name');
      if (error) throw error;
      return data;
    },
  });

  const addPreset = useMutation({
    mutationFn: async (preset: { preset_name: string; description: string; default_labour_cost: number; default_base_cost: number }) => {
      const { error } = await supabase.from('service_presets').insert({ ...preset, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['service_presets'] }); toast.success('Preset added!'); },
    onError: (e) => toast.error(e.message),
  });

  const updatePreset = useMutation({
    mutationFn: async ({ id, ...preset }: { id: string; preset_name: string; description: string; default_labour_cost: number; default_base_cost: number }) => {
      const { error } = await supabase.from('service_presets').update(preset).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['service_presets'] }); toast.success('Preset updated!'); },
    onError: (e) => toast.error(e.message),
  });

  const deletePreset = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('service_presets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['service_presets'] }); toast.success('Preset deleted!'); },
    onError: (e) => toast.error(e.message),
  });

  return { ...query, addPreset, updatePreset, deletePreset };
};
