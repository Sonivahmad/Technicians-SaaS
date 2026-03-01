import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Fuel, Users, Package, MoreHorizontal, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const expenseTypes = [
  { value: 'fuel', label: 'Fuel / ईंधन', icon: Fuel },
  { value: 'helper', label: 'Helper / हेल्पर', icon: Users },
  { value: 'parts', label: 'Parts / पार्ट्स', icon: Package },
  { value: 'other', label: 'Other / अन्य', icon: MoreHorizontal },
] as const;

const typeIconMap: Record<string, typeof Fuel> = {
  fuel: Fuel, helper: Users, parts: Package, other: MoreHorizontal,
};

const typeLabelMap: Record<string, string> = {
  fuel: 'Fuel / ईंधन', helper: 'Helper / हेल्पर', parts: 'Parts / पार्ट्स', other: 'Other / अन्य',
};

const defaultForm = () => ({ expense_type: 'fuel', amount: '', date: format(new Date(), 'yyyy-MM-dd') });

const ExpensesPage = () => {
  const navigate = useNavigate();
  const { data: expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setEditId(null); setForm(defaultForm()); setDialogOpen(true); };
  const openEdit = (exp: any) => {
    setEditId(exp.id);
    setForm({ expense_type: exp.expense_type, amount: String(exp.amount), date: exp.date });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return;
    const payload = { expense_type: form.expense_type, amount, date: form.date };
    if (editId) {
      updateExpense.mutate({ id: editId, ...payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      addExpense.mutate(payload, { onSuccess: () => { setDialogOpen(false); setForm(defaultForm()); } });
    }
  };

  const handleDelete = () => {
    if (deleteId) deleteExpense.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const saving = addExpense.isPending || updateExpense.isPending;

  // Group expenses by date
  const grouped = (expenses ?? []).reduce<Record<string, typeof expenses>>((acc, exp) => {
    const key = exp.date;
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(exp);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="safe-bottom px-4 pb-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-display font-bold text-foreground">Expenses / खर्चे</h1>
      </div>

      <Button className="w-full mb-4" onClick={openAdd}>
        <Plus className="h-4 w-4 mr-2" /> Add Expense / खर्चा जोड़ें
      </Button>

      {isLoading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}

      {sortedDates.map(date => (
        <div key={date} className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            {format(new Date(date + 'T00:00:00'), 'dd MMM yyyy')}
          </p>
          <div className="space-y-2">
            {grouped[date]!.map(exp => {
              const Icon = typeIconMap[exp.expense_type] || MoreHorizontal;
              return (
                <div key={exp.id} className="rounded-xl bg-card p-3 shadow-card flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-card-foreground">{typeLabelMap[exp.expense_type] || exp.expense_type}</p>
                  </div>
                  <p className="text-sm font-bold text-card-foreground shrink-0 mr-1">₹{exp.amount}</p>
                  <div className="flex gap-0 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(exp)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(exp.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {!isLoading && (expenses?.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No expenses yet.</p>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[92vw] rounded-xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit' : 'Add'} Expense</DialogTitle>
            <DialogDescription>{editId ? 'Update expense details' : 'Log a daily expense'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Type / प्रकार</Label>
              <Select value={form.expense_type} onValueChange={v => setForm(f => ({ ...f, expense_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {expenseTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount / राशि ₹ *</Label>
              <Input type="number" min="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <Label>Date / तारीख</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving || !form.amount || Number(form.amount) <= 0}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpensesPage;
