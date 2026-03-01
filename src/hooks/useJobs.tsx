import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useJobs = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, customers(*), service_presets(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addJob = useMutation({
    mutationFn: async (job: {
      customer_id: string;
      preset_id: string;
      selected_parts: unknown[];
      subtotal: number;
      discount_type: string | null;
      discount_value: number;
      final_amount: number;
      payment_status: string;
      service_date: string;
      next_service_date: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          customer_id: job.customer_id,
          preset_id: job.preset_id,
          selected_parts: job.selected_parts as unknown as import('@/integrations/supabase/types').Json,
          subtotal: job.subtotal,
          discount_type: job.discount_type,
          discount_value: job.discount_value,
          final_amount: job.final_amount,
          payment_status: job.payment_status,
          service_date: job.service_date,
          next_service_date: job.next_service_date,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job saved! / जॉब सेव हो गया!');
    },
    onError: (err: Error) => toast.error(err.message),
  });
  const markAsPaid = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("jobs")
        .update({ payment_status: "paid" })
        .eq("id", jobId);
  
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Marked as Paid! / भुगतान पूरा");
    },
    onError: (err: Error) => toast.error(err.message),
  });
  return { ...query, addJob, markAsPaid };
};
