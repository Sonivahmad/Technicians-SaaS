import { BarChart3, TrendingUp, Users, MapPin } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useExpenses } from '@/hooks/useExpenses';
import KPICard from '@/components/KPICard';

const Reports = () => {
  const { data: jobs = [], isLoading: jl } = useJobs();
  const { data: expenses = [], isLoading: el } = useExpenses();

  if (jl || el) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const totalJobs = jobs.length;
  const totalRevenue = jobs.filter(j => j.payment_status === 'paid').reduce((s, j) => s + Number(j.final_amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const avgJobValue = totalJobs > 0 ? Math.round(totalRevenue / totalJobs) : 0;

  return (
    <div className="safe-bottom px-4 pb-4">
      <h1 className="text-lg font-display font-bold text-foreground mb-4">Reports / रिपोर्ट</h1>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <KPICard title="Total Jobs" value={`${totalJobs}`} icon={BarChart3} gradient="primary" subtitle="कुल जॉब" />
        <KPICard title="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={TrendingUp} gradient="success" subtitle="कुल आय" />
        <KPICard title="Avg Job Value" value={`₹${avgJobValue.toLocaleString('en-IN')}`} icon={Users} gradient="warning" subtitle="औसत जॉब मूल्य" />
        <KPICard title="Expenses" value={`₹${totalExpenses.toLocaleString('en-IN')}`} icon={MapPin} gradient="danger" subtitle="कुल खर्चे" />
      </div>

      <h2 className="text-sm font-semibold text-foreground mb-3">All Jobs / सभी जॉब</h2>
      {jobs.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">No jobs yet / अभी कोई जॉब नहीं</p>
      ) : (
        <div className="space-y-2">
          {jobs.map(job => (
            <div key={job.id} className="rounded-xl bg-card p-3 shadow-card animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{job.customers?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{job.service_presets?.preset_name || ''} • {job.service_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">₹{Number(job.final_amount).toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] font-medium ${job.payment_status === 'paid' ? 'text-success' : 'text-warning'}`}>
                    {job.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
