import { LayoutDashboard, PlusCircle, Users, Wallet, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', labelHi: 'डैशबोर्ड' },
  { path: '/customers', icon: Users, label: 'Customers', labelHi: 'ग्राहक' },
  { path: '/add-job', icon: PlusCircle, label: 'Add Job', labelHi: 'नया जॉब', isMain: true },
  { path: '/expenses', icon: Wallet, label: 'Expenses', labelHi: 'खर्चे' },
  { path: '/settings', icon: Settings, label: 'Settings', labelHi: 'सेटिंग्स' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-elevated">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative -mt-5 flex flex-col items-center"
              >
                <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-full shadow-elevated">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="mt-1 text-[10px] font-medium text-primary">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center py-2 px-3 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
              <span className="mt-1 text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
