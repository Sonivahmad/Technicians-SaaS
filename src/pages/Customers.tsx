import { useState } from 'react';
import { Search, Plus, Phone, MapPin, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCustomers } from '@/hooks/useCustomers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Customers = () => {
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [open, setOpen] = useState(false);
  const { data: customers = [], isLoading, addCustomer } = useCustomers();

  const filtered = customers.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search)
  );

  const handleAdd = () => {
    if (!name || !mobile) return;
    addCustomer.mutate({ name, mobile, address }, {
      onSuccess: () => { setName(''); setMobile(''); setAddress(''); setOpen(false); },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="safe-bottom px-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-display font-bold text-foreground">Customers / ग्राहक</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground border-0">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">New Customer / नया ग्राहक</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div><Label>Name / नाम</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Customer name" /></div>
              <div><Label>Mobile / मोबाइल</Label><Input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="9876543210" type="tel" maxLength={10} /></div>
              <div><Label>Address / पता</Label><Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address" /></div>
              <Button onClick={handleAdd} disabled={addCustomer.isPending} className="w-full gradient-primary text-primary-foreground border-0">
                {addCustomer.isPending ? 'Saving...' : 'Save Customer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or mobile..." className="pl-9" />
      </div>

      <div className="space-y-2">
        {filtered.map(customer => (
          <div key={customer.id} className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-card animate-fade-in">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground truncate">{customer.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {customer.mobile}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> <span className="truncate">{customer.address}</span></div>
            </div>
            <a href={`tel:${customer.mobile}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success">
              <Phone className="h-4 w-4" />
            </a>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No customers found</p>}
      </div>
    </div>
  );
};

export default Customers;
