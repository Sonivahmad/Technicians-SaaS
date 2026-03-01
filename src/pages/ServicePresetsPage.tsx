import { useState } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useServicePresets } from '@/hooks/useServicePresets';
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

interface PresetForm {
  preset_name: string;
  description: string;
  default_labour_cost: string;
  default_base_cost: string;
}

const empty: PresetForm = { preset_name: '', description: '', default_labour_cost: '', default_base_cost: '' };

const ServicePresetsPage = () => {
  const navigate = useNavigate();
  const { data: presets, isLoading, addPreset, updatePreset, deletePreset } = useServicePresets();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PresetForm>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setEditId(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ preset_name: p.preset_name, description: p.description || '', default_labour_cost: String(p.default_labour_cost), default_base_cost: String(p.default_base_cost) });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const payload = {
      preset_name: form.preset_name.trim(),
      description: form.description.trim(),
      default_labour_cost: Number(form.default_labour_cost) || 0,
      default_base_cost: Number(form.default_base_cost) || 0,
    };
    if (!payload.preset_name) return;
    if (editId) {
      updatePreset.mutate({ id: editId, ...payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      addPreset.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = () => {
    if (deleteId) deletePreset.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const saving = addPreset.isPending || updatePreset.isPending;

  return (
    <div className="safe-bottom px-4 pb-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-display font-bold text-foreground">Service Presets / सर्विस प्रीसेट</h1>
      </div>

      <Button className="w-full mb-4" onClick={openAdd}>
        <Plus className="h-4 w-4 mr-2" /> Add Preset / प्रीसेट जोड़ें
      </Button>

      {isLoading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}

      <div className="space-y-2">
        {presets?.map(p => (
          <div key={p.id} className="rounded-xl bg-card p-3 shadow-card flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground truncate">{p.preset_name}</p>
              {p.description && <p className="text-xs text-muted-foreground truncate">{p.description}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                Labour ₹{p.default_labour_cost} · Base ₹{p.default_base_cost}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {!isLoading && presets?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No presets yet. Add one above!</p>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[92vw] rounded-xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit' : 'Add'} Preset</DialogTitle>
            <DialogDescription>{editId ? 'Update service preset details' : 'Create a new service preset'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name / नाम *</Label>
              <Input value={form.preset_name} onChange={e => setForm(f => ({ ...f, preset_name: e.target.value }))} maxLength={100} placeholder="e.g. AC Regular Service" />
            </div>
            <div>
              <Label>Description / विवरण</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} maxLength={200} placeholder="Optional description" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Labour Cost / मजदूरी ₹</Label>
                <Input type="number" min="0" value={form.default_labour_cost} onChange={e => setForm(f => ({ ...f, default_labour_cost: e.target.value }))} placeholder="0" />
              </div>
              <div>
                <Label>Base Cost / बेस ₹</Label>
                <Input type="number" min="0" value={form.default_base_cost} onChange={e => setForm(f => ({ ...f, default_base_cost: e.target.value }))} placeholder="0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving || !form.preset_name.trim()}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Preset?</AlertDialogTitle>
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

export default ServicePresetsPage;
