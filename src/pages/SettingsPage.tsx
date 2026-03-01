import { User, Building2, Wrench, Package, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: User, label: 'Profile / प्रोफाइल', desc: 'Edit your business details', route: null },
  { icon: Building2, label: 'Business Info / व्यवसाय', desc: 'Company name, logo, address', route: null },
  { icon: Wrench, label: 'Service Presets / सर्विस', desc: 'Manage service types & pricing', route: '/settings/presets' },
  { icon: Package, label: 'Spare Parts / पार्ट्स', desc: 'Manage parts inventory', route: '/settings/parts' },
  { icon: CreditCard, label: 'Subscription / सब्सक्रिप्शन', desc: 'Plan & billing details', route: null },
];

const SettingsPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="safe-bottom px-4 pb-4">
      <h1 className="text-lg font-display font-bold text-foreground mb-4">Settings / सेटिंग्स</h1>

      <div className="space-y-2 mb-6">
        {menuItems.map(item => (
          <button
            key={item.label}
            onClick={() => item.route ? navigate(item.route) : toast.info('Coming soon!')}
            className="w-full flex items-center gap-3 rounded-xl bg-card p-3 shadow-card text-left transition-all active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full border-destructive text-destructive"
        onClick={signOut}
      >
        <LogOut className="h-4 w-4 mr-2" /> Logout / लॉगआउट
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-4">CoolTech AC Manager v1.0</p>
    </div>
  );
};

export default SettingsPage;
