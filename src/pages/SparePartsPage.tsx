import { useState } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSpareParts } from '@/hooks/useSpareParts';
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

interface PartForm {
  part_name: string;
  price: string;
}

const empty: PartForm = { part_name: '', price: '' };

const SparePartsPage = () => {
  const navigate = useNavigate();
  const { data: parts, isLoading, addPart, updatePart, deletePart } = useSpareParts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PartForm>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setEditId(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ part_name: p.part_name, price: String(p.price) });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const payload = { part_name: form.part_name.trim(), price: Number(form.price) || 0 };
    if (!payload.part_name) return;
    if (editId) {
      updatePart.mutate({ id: editId, ...payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      addPart.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = () => {
    if (deleteId) deletePart.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const saving = addPart.isPending || updatePart.isPending;

  return (
    <div className="safe-bottom px-4 pb-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-display font-bold text-foreground">Spare Parts / स्पेयर पार्ट्स</h1>
      </div>

      <Button className="w-full mb-4" onClick={openAdd}>
        <Plus className="h-4 w-4 mr-2" /> Add Part / पार्ट जोड़ें
      </Button>

      {isLoading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}

      <div className="space-y-2">
        {parts?.map(p => (
          <div key={p.id} className="rounded-xl bg-card p-3 shadow-card flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground truncate">{p.part_name}</p>
              <p className="text-xs text-muted-foreground">₹{p.price}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {!isLoading && parts?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No parts yet. Add one above!</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[92vw] rounded-xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit' : 'Add'} Part</DialogTitle>
            <DialogDescription>{editId ? 'Update spare part details' : 'Create a new spare part'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Part Name / पार्ट का नाम *</Label>
              <Input value={form.part_name} onChange={e => setForm(f => ({ ...f, part_name: e.target.value }))} maxLength={100} placeholder="e.g. Capacitor 35μF" />
            </div>
            <div>
              <Label>Price / कीमत ₹ *</Label>
              <Input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving || !form.part_name.trim()}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Part?</AlertDialogTitle>
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

export default SparePartsPage;
