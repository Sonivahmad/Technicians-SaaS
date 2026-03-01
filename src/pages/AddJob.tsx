import { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronLeft, Check, IndianRupee, Percent, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCustomers } from '@/hooks/useCustomers';
import { useServicePresets } from '@/hooks/useServicePresets';
import { useSpareParts } from '@/hooks/useSpareParts';
import { useJobs } from '@/hooks/useJobs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { addMonths, format } from 'date-fns';

const steps = ['Customer', 'Service', 'Parts', 'Discount', 'Review'];

const AddJob = () => {
  const navigate = useNavigate();
  const { data: customers = [], addCustomer } = useCustomers();
  const { data: presets = [] } = useServicePresets();
  const { data: parts = [] } = useSpareParts();
  const { addJob } = useJobs();

  const [step, setStep] = useState(0);
  const [mobileSearch, setMobileSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [selectedCustomerMobile, setSelectedCustomerMobile] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [selectedPartIds, setSelectedPartIds] = useState<string[]>([]);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage' | null>(null);
  const [discountValue, setDiscountValue] = useState(0);

  const foundCustomer = useMemo(() => {
    if (mobileSearch.length >= 3) {
      return customers.find(c => c.mobile.includes(mobileSearch));
    }
    return undefined;
  }, [mobileSearch, customers]);

  const selectedPreset = presets.find(p => p.id === selectedPresetId);
  const selectedParts = parts.filter(p => selectedPartIds.includes(p.id));

  const subtotal = useMemo(() => {
    const presetCost = selectedPreset ? Number(selectedPreset.default_labour_cost) + Number(selectedPreset.default_base_cost) : 0;
    const partsCost = selectedParts.reduce((sum, p) => sum + Number(p.price), 0);
    return presetCost + partsCost;
  }, [selectedPreset, selectedParts]);

  const discountAmount = useMemo(() => {
    if (!discountType || discountValue <= 0) return 0;
    if (discountType === 'percentage') return Math.round(subtotal * discountValue / 100);
    return discountValue;
  }, [subtotal, discountType, discountValue]);

  const finalAmount = subtotal - discountAmount;

  const togglePart = (partId: string) => {
    setSelectedPartIds(prev =>
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const canNext = () => {
    if (step === 0) return !!selectedCustomerId;
    if (step === 1) return !!selectedPresetId;
    return true;
  };

  const handleSave = () => {
    if (!selectedCustomerId || !selectedPresetId) return;
    const serviceDate = format(new Date(), 'yyyy-MM-dd');
    const nextServiceDate = format(addMonths(new Date(), 6), 'yyyy-MM-dd');

    addJob.mutate({
      customer_id: selectedCustomerId,
      preset_id: selectedPresetId,
      selected_parts: selectedParts.map(p => ({ id: p.id, part_name: p.part_name, price: Number(p.price) })),
      subtotal,
      discount_type: discountType,
      discount_value: discountValue,
      final_amount: finalAmount,
      payment_status: 'pending',
      service_date: serviceDate,
      next_service_date: nextServiceDate,
    }, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div className="safe-bottom px-4 pb-4">
      <h1 className="text-lg font-display font-bold text-foreground mb-2">New Job / नया जॉब</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={cn(
              'flex h-7 items-center rounded-full px-3 text-xs font-medium transition-all',
              i === step ? 'gradient-primary text-primary-foreground'
                : i < step ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
            )}>
              {i < step ? <Check className="h-3 w-3 mr-1" /> : null}{s}
            </div>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground mx-0.5 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step 0: Customer */}
      {step === 0 && (
        <div className="space-y-3 animate-fade-in">
          <div>
            <Label>Mobile Number / मोबाइल नंबर</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={mobileSearch} onChange={e => { setMobileSearch(e.target.value); setSelectedCustomerId(null); }} placeholder="Enter mobile number" className="pl-9 text-lg" type="tel" maxLength={10} />
            </div>
          </div>

          {foundCustomer && !selectedCustomerId && (
            <button onClick={() => { setSelectedCustomerId(foundCustomer.id); setSelectedCustomerName(foundCustomer.name); setSelectedCustomerMobile(foundCustomer.mobile); }} className="w-full rounded-xl border-2 border-success/40 bg-success/5 p-3 text-left animate-fade-in">
              <p className="text-sm font-semibold text-card-foreground">{foundCustomer.name}</p>
              <p className="text-xs text-muted-foreground">{foundCustomer.address}</p>
              <p className="text-xs text-success mt-1">Tap to select / चुनने के लिए टैप करें</p>
            </button>
          )}

          {selectedCustomerId && (
            <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-3 animate-fade-in">
              <p className="text-sm font-semibold text-card-foreground">✅ {selectedCustomerName}</p>
              <p className="text-xs text-muted-foreground">{selectedCustomerMobile}</p>
            </div>
          )}

          {mobileSearch.length >= 10 && !foundCustomer && (
            <div className="space-y-3 rounded-xl border border-border bg-card p-3 animate-fade-in">
              <p className="text-xs font-medium text-warning">New customer / नया ग्राहक</p>
              <Input value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} placeholder="Customer name / ग्राहक का नाम" />
              <Input value={newCustomerAddress} onChange={e => setNewCustomerAddress(e.target.value)} placeholder="Address / पता" />
              <Button
                onClick={() => {
                  if (!newCustomerName) return toast.error('Enter customer name');
                  addCustomer.mutate({ name: newCustomerName, mobile: mobileSearch, address: newCustomerAddress }, {
                    onSuccess: (data) => {
                      setSelectedCustomerId(data.id);
                      setSelectedCustomerName(data.name);
                      setSelectedCustomerMobile(data.mobile);
                    },
                  });
                }}
                disabled={addCustomer.isPending}
                className="w-full gradient-primary text-primary-foreground border-0" size="sm"
              >
                {addCustomer.isPending ? 'Adding...' : 'Add & Select'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 1: Service Preset */}
      {step === 1 && (
        <div className="space-y-2 animate-fade-in">
          <Label>Select Service / सर्विस चुनें</Label>
          {presets.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No service presets yet. Add them in Settings.</p>}
          {presets.map(preset => (
            <button key={preset.id} onClick={() => setSelectedPresetId(preset.id)}
              className={cn('w-full rounded-xl border-2 p-3 text-left transition-all',
                selectedPresetId === preset.id ? 'border-primary bg-primary/5' : 'border-border bg-card')}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-card-foreground">{preset.preset_name}</p>
                <div className="flex items-center text-sm font-bold text-primary">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {(Number(preset.default_labour_cost) + Number(preset.default_base_cost)).toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{preset.description}</p>
              <div className="flex gap-3 mt-1 text-[11px] text-muted-foreground">
                <span>Labour: ₹{Number(preset.default_labour_cost)}</span>
                <span>Base: ₹{Number(preset.default_base_cost)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Spare Parts */}
      {step === 2 && (
        <div className="space-y-2 animate-fade-in">
          <Label>Add Parts (Optional) / पार्ट्स जोड़ें</Label>
          {parts.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No spare parts yet. Add them in Settings.</p>}
          {parts.map(part => {
            const isSelected = selectedPartIds.includes(part.id);
            return (
              <button key={part.id} onClick={() => togglePart(part.id)}
                className={cn('w-full rounded-xl border-2 p-3 text-left transition-all flex items-center justify-between',
                  isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card')}>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{part.part_name}</p>
                  <p className="text-xs text-muted-foreground flex items-center"><IndianRupee className="h-3 w-3" />{Number(part.price).toLocaleString('en-IN')}</p>
                </div>
                {isSelected && <Check className="h-5 w-5 text-primary" />}
              </button>
            );
          })}
          {selectedParts.length > 0 && (
            <div className="rounded-xl bg-primary/5 p-3 text-sm font-medium text-primary">
              Parts Total: ₹{selectedParts.reduce((s, p) => s + Number(p.price), 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Discount */}
      {step === 3 && (
        <div className="space-y-3 animate-fade-in">
          <Label>Discount (Optional) / छूट</Label>
          <div className="flex gap-2">
            <button onClick={() => setDiscountType(discountType === 'fixed' ? null : 'fixed')}
              className={cn('flex-1 rounded-xl border-2 p-3 text-center transition-all', discountType === 'fixed' ? 'border-primary bg-primary/5' : 'border-border bg-card')}>
              <Minus className="h-5 w-5 mx-auto text-card-foreground" />
              <p className="text-xs font-medium mt-1 text-card-foreground">Fixed / निश्चित</p>
            </button>
            <button onClick={() => setDiscountType(discountType === 'percentage' ? null : 'percentage')}
              className={cn('flex-1 rounded-xl border-2 p-3 text-center transition-all', discountType === 'percentage' ? 'border-primary bg-primary/5' : 'border-border bg-card')}>
              <Percent className="h-5 w-5 mx-auto text-card-foreground" />
              <p className="text-xs font-medium mt-1 text-card-foreground">Percent / प्रतिशत</p>
            </button>
          </div>
          {discountType && (
            <div>
              <Label>{discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}</Label>
              <Input type="number" value={discountValue || ''} onChange={e => setDiscountValue(Number(e.target.value))} placeholder={discountType === 'percentage' ? 'e.g. 10' : 'e.g. 500'} className="text-lg mt-1" />
            </div>
          )}
          <div className="rounded-xl bg-card p-3 shadow-card space-y-1">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium text-card-foreground">₹{subtotal.toLocaleString('en-IN')}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-destructive">Discount</span><span className="text-destructive">-₹{discountAmount.toLocaleString('en-IN')}</span></div>}
            <div className="flex justify-between text-base font-bold border-t border-border pt-1 mt-1">
              <span className="text-card-foreground">Total</span><span className="text-primary">₹{finalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-3 animate-fade-in">
          <div className="rounded-xl bg-card p-4 shadow-card space-y-3">
            <h3 className="font-display font-bold text-card-foreground">Invoice Summary / बिल</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium text-card-foreground">{selectedCustomerName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium text-card-foreground">{selectedPreset?.preset_name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Labour</span><span className="text-card-foreground">₹{Number(selectedPreset?.default_labour_cost || 0).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Base Cost</span><span className="text-card-foreground">₹{Number(selectedPreset?.default_base_cost || 0).toLocaleString('en-IN')}</span></div>
              {selectedParts.length > 0 && (
                <>
                  <p className="text-muted-foreground font-medium pt-1">Parts:</p>
                  {selectedParts.map(p => (
                    <div key={p.id} className="flex justify-between pl-2">
                      <span className="text-muted-foreground">{p.part_name}</span>
                      <span className="text-card-foreground">₹{Number(p.price).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </>
              )}
              <div className="border-t border-border my-2" />
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-card-foreground">₹{subtotal.toLocaleString('en-IN')}</span></div>
              {discountAmount > 0 && <div className="flex justify-between"><span className="text-destructive">Discount</span><span className="text-destructive">-₹{discountAmount.toLocaleString('en-IN')}</span></div>}
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
                <span className="text-card-foreground">Total / कुल</span><span className="text-primary">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        )}
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="flex-1 gradient-primary text-primary-foreground border-0">
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={addJob.isPending} className="flex-1 gradient-success text-success-foreground border-0">
            <Check className="h-4 w-4 mr-1" /> {addJob.isPending ? 'Saving...' : 'Save Job / सेव करें'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddJob;
