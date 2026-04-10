import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

export type RoomStatus = 'available' | 'occupied' | 'upcoming';

interface RoomStatusBadgeProps {
  status: RoomStatus;
  className?: string;
  showDot?: boolean;
}

const statusConfig: Record<RoomStatus, { label: string; dotClass: string; badgeClass: string }> = {
  available: {
    label: 'Disponible',
    dotClass: 'text-success animate-pulse',
    badgeClass: 'bg-success/15 text-success border-success/30 hover:bg-success/20',
  },
  occupied: {
    label: 'Occupée',
    dotClass: 'text-destructive',
    badgeClass: 'bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20',
  },
  upcoming: {
    label: 'Bientôt occupée',
    dotClass: 'text-warning',
    badgeClass: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/20',
  },
};

export function getRoomStatus(
  roomId: number,
  reservations: Array<{ roomId: number; date: string; startTime: string; endTime: string; status?: string }>
): RoomStatus {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayRes = reservations.filter(
    (r) => r.roomId === roomId && r.date === today && r.status !== 'CANCELLED'
  );

  for (const r of todayRes) {
    const [sh, sm] = r.startTime.split(':').map(Number);
    const [eh, em] = r.endTime.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (currentMinutes >= start && currentMinutes < end) return 'occupied';
  }

  for (const r of todayRes) {
    const [sh, sm] = r.startTime.split(':').map(Number);
    const start = sh * 60 + sm;
    if (start > currentMinutes && start - currentMinutes <= 30) return 'upcoming';
  }

  return 'available';
}

const RoomStatusBadge = ({ status, className, showDot = true }: RoomStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-semibold shadow-sm transition-colors',
        config.badgeClass,
        className
      )}
    >
      {showDot && <Circle size={8} className={cn('mr-1.5 fill-current', config.dotClass)} />}
      {config.label}
    </Badge>
  );
};

export default RoomStatusBadge;
