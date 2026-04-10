import { useEffect, useState } from 'react';
import { reservationService } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/badge';

interface Reservation {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  userName: string;
  roomName: string;
}

const AdminReservations = () => {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reservationService.getAll()
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Toutes les réservations</h1>

      <div className="space-y-4">
        {data.map(r => (
          <div key={r.id} className="border p-4 rounded-lg flex justify-between items-center">

            <div>
              <p className="font-semibold">{r.roomName}</p>
              <p className="text-sm text-muted-foreground">
                👤 {r.userName}
              </p>
              <p className="text-sm">
                {r.date} | {r.startTime} - {r.endTime}
              </p>
            </div>

            <Badge variant={r.status === 'CONFIRMED' ? 'default' : 'destructive'}>
              {r.status}
            </Badge>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReservations;