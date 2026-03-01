import { CheckCircle2, Clock, IndianRupee } from 'lucide-react';
import { Job } from '@/types';
import { cn } from '@/lib/utils';
import { useJobs } from "@/hooks/useJobs";

interface RecentJobCardProps {
  job: Job;
}

const RecentJobCard = ({ job }: RecentJobCardProps) => {
  const isPaid = job.payment_status === "paid";
  const { markAsPaid } = useJobs();

  return (
    <div className="rounded-xl bg-card p-3 shadow-card animate-fade-in">
      
      {/* Top Row */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isPaid
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          )}
        >
          {isPaid ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Clock className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-foreground truncate">
            {job.customer?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {job.preset?.preset_name} • {job.service_date}
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center text-sm font-bold text-card-foreground">
            <IndianRupee className="h-3.5 w-3.5" />
            {job.final_amount.toLocaleString("en-IN")}
          </div>
          <span
            className={cn(
              "text-[10px] font-medium",
              isPaid ? "text-success" : "text-warning"
            )}
          >
            {isPaid ? "Paid" : "Pending"}
          </span>
        </div>
      </div>

      {/* Mark as Paid Button */}
      {!isPaid && (
        <button
          onClick={() => markAsPaid.mutate(job.id)}
          className="mt-3 w-full rounded-lg bg-green-500 text-white py-2 text-sm font-medium hover:bg-green-600 transition"
        >
          Mark as Paid
        </button>
      )}
    </div>
  );
};
export default RecentJobCard;