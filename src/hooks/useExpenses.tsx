import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useExpenses = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addExpense = useMutation({
    mutationFn: async (expense: { expense_type: string; amount: number; date: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense added! / खर्चा जोड़ा गया!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, ...expense }: { id: string; expense_type: string; amount: number; date: string }) => {
      const { error } = await supabase.from('expenses').update(expense).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { ...query, addExpense, updateExpense, deleteExpense };
};
