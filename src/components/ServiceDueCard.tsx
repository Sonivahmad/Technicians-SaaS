import { Bell, Phone } from 'lucide-react';
import { Job } from '@/types';

interface ServiceDueCardProps {
  job: Job;
}

const ServiceDueCard = ({ job }: ServiceDueCardProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 p-3 animate-fade-in">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-warning">
        <Bell className="h-5 w-5 text-warning-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-card-foreground truncate">
          {job.customer?.name}
        </p>
        <p className="text-xs text-muted-foreground">
          Service Due • {job.preset?.preset_name}
        </p>
      </div>
      <a
        href={`tel:${job.customer?.mobile}`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-success-foreground"
      >
        <Phone className="h-4 w-4" />
      </a>
    </div>
  );
};

export default ServiceDueCard;
