import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { reservationService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CalendarCheck, X, Clock, DoorOpen } from 'lucide-react';
import { getRoomImage } from '@/lib/roomImages';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Reservation {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'CANCELLED';
  room?: { id: number; name: string; image?: string };
}

const statusLabels: Record<string, string> = {
  CONFIRMED: 'Confirmée',
  CANCELLED: 'Annulée',
};

const MyReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await reservationService.getMyReservations();
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: number) => {
    try {
      await reservationService.cancel(id);
      toast.success('Réservation annulée avec succès');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Échec de l\'annulation');
    }
  };

  if (loading) return <LoadingSpinner className="mt-32" text="Chargement des réservations..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Mes Réservations</h1>
        <p className="text-muted-foreground mt-1">Consultez et gérez vos réservations de salles</p>
      </motion.div>

      {reservations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
            <CalendarCheck size={28} />
          </div>
          <p className="text-lg font-medium">Aucune réservation</p>
          <p className="text-sm">Créez votre première réservation depuis la page Salles.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-36 h-28 sm:h-auto shrink-0">
                <img
                  src={getRoomImage(r.room?.id || r.id, r.room?.image)}
                  alt={r.room?.name || 'Salle'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{r.room?.name || `Salle #${r.id}`}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarCheck size={14} /> {r.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {r.startTime} – {r.endTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={r.status === 'CONFIRMED' ? 'default' : 'destructive'} className="text-xs">
                    {statusLabels[r.status] || r.status}
                  </Badge>
                  {r.status === 'CONFIRMED' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <X size={16} className="mr-1" /> Annuler
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir annuler cette réservation pour <strong>{r.room?.name}</strong> le {r.date} de {r.startTime} à {r.endTime} ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Non, garder</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCancel(r.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Oui, annuler
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;