import { IndianRupee, TrendingUp, TrendingDown, Clock, CalendarClock, Wallet } from 'lucide-react';
import KPICard from '@/components/KPICard';
import ServiceDueCard from '@/components/ServiceDueCard';
import RecentJobCard from '@/components/RecentJobCard';
import { useJobs } from '@/hooks/useJobs';
import { useExpenses } from '@/hooks/useExpenses';

const Dashboard = () => {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();

  const today = new Date().toISOString().split('T')[0];

  const todayIncome = jobs
    .filter(j => j.service_date === today && j.payment_status === 'paid')
    .reduce((sum, j) => sum + Number(j.final_amount), 0);

  const monthlyIncome = jobs
    .filter(j => j.payment_status === 'paid')
    .reduce((sum, j) => sum + Number(j.final_amount), 0);

  const monthlyExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const pendingPayments = jobs
    .filter(j => j.payment_status === 'pending')
    .reduce((sum, j) => sum + Number(j.final_amount), 0);

  const serviceDueJobs = jobs.filter(j => {
    if (!j.next_service_date) return false;
    return new Date(j.next_service_date) <= new Date();
  });

  if (jobsLoading || expensesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="safe-bottom px-4 pb-4">
      <div className="gradient-cool rounded-2xl p-5 mb-5">
        <p className="text-primary-foreground/80 text-sm">Welcome back 👋</p>
        <h1 className="text-xl font-display font-bold text-primary-foreground mt-1">CoolTech Services</h1>
        <p className="text-primary-foreground/60 text-xs mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <KPICard title="Today's Income" value={`₹${todayIncome.toLocaleString('en-IN')}`} icon={IndianRupee} gradient="primary" subtitle="आज की कमाई" />
        <KPICard title="Monthly Income" value={`₹${monthlyIncome.toLocaleString('en-IN')}`} icon={TrendingUp} gradient="success" subtitle="महीने की कमाई" />
        <KPICard title="Expenses" value={`₹${monthlyExpenses.toLocaleString('en-IN')}`} icon={TrendingDown} gradient="danger" subtitle="खर्चे" />
        <KPICard title="Pending" value={`₹${pendingPayments.toLocaleString('en-IN')}`} icon={Clock} gradient="warning" subtitle="बाकी पेमेंट" />
      </div>

      <div className="rounded-xl bg-card p-4 shadow-card mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Net Profit / शुद्ध लाभ</p>
          <p className="text-2xl font-display font-bold text-success">₹{(monthlyIncome - monthlyExpenses).toLocaleString('en-IN')}</p>
        </div>
        <Wallet className="h-8 w-8 text-success/30" />
      </div>

      {serviceDueJobs.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold text-foreground">Service Due / सर्विस बाकी</h2>
          </div>
          <div className="space-y-2">
            {serviceDueJobs.map(job => (
              <ServiceDueCard key={job.id} job={{
                id: job.id,
                customer_id: job.customer_id,
                preset_id: job.preset_id,
                selected_parts: [],
                subtotal: Number(job.subtotal),
                discount_type: job.discount_type as 'percentage' | 'fixed' | null,
                discount_value: Number(job.discount_value),
                final_amount: Number(job.final_amount),
                payment_status: job.payment_status as 'paid' | 'pending' | 'partial',
                service_date: job.service_date,
                next_service_date: job.next_service_date || '',
                created_at: job.created_at,
                customer: job.customers ? { id: job.customers.id, name: job.customers.name, mobile: job.customers.mobile, address: job.customers.address, created_at: job.customers.created_at } : undefined,
                preset: job.service_presets ? { id: job.service_presets.id, preset_name: job.service_presets.preset_name, default_labour_cost: Number(job.service_presets.default_labour_cost), default_base_cost: Number(job.service_presets.default_base_cost), description: job.service_presets.description } : undefined,
              }} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Jobs / हाल के काम</h2>
        {jobs.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No jobs yet. Add your first job! / अभी कोई जॉब नहीं</p>
        ) : (
          <div className="space-y-2">
            {jobs.slice(0, 5).map(job => (
              <RecentJobCard key={job.id} job={{
                id: job.id,
                customer_id: job.customer_id,
                preset_id: job.preset_id,
                selected_parts: [],
                subtotal: Number(job.subtotal),
                discount_type: job.discount_type as 'percentage' | 'fixed' | null,
                discount_value: Number(job.discount_value),
                final_amount: Number(job.final_amount),
                payment_status: job.payment_status as 'paid' | 'pending' | 'partial',
                service_date: job.service_date,
                next_service_date: job.next_service_date || '',
                created_at: job.created_at,
                customer: job.customers ? { id: job.customers.id, name: job.customers.name, mobile: job.customers.mobile, address: job.customers.address, created_at: job.customers.created_at } : undefined,
                preset: job.service_presets ? { id: job.service_presets.id, preset_name: job.service_presets.preset_name, default_labour_cost: Number(job.service_presets.default_labour_cost), default_base_cost: Number(job.service_presets.default_base_cost), description: job.service_presets.description } : undefined,
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
