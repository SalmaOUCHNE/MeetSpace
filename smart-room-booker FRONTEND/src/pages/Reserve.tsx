import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { reservationService, roomService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CalendarPlus, Clock, CalendarDays } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface Room {
  id: number;
  name: string;
}

const Reserve = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { roomId?: number; roomName?: string } | null;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState(state?.roomId?.toString() || '');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    roomService.getAll()
      .then((res) => setRooms(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !date || !startTime || !endTime) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    if (date < today) {
      toast.error('Impossible de réserver dans le passé');
      return;
    }
    if (startTime >= endTime) {
      toast.error('L\'heure de fin doit être après l\'heure de début');
      return;
    }
    // Check if date is today and start time is in the past
    if (date === today) {
      const now = new Date();
      const [h, m] = startTime.split(':').map(Number);
      if (h * 60 + m < now.getHours() * 60 + now.getMinutes()) {
        toast.error('L\'heure de début est déjà passée');
        return;
      }
    }
    setLoading(true);
    try {
      await reservationService.create({
        roomId: Number(roomId),
        date,
        startTime,
        endTime,
      });
      toast.success('Réservation créée avec succès !');
      navigate('/my-reservations');
    } catch (err: any) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('conflict') || msg.toLowerCase().includes('overlap')) {
        toast.error('Conflit de réservation : cette salle est déjà réservée pour ce créneau');
      } else {
        toast.error(msg || 'Échec de la création de la réservation');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Créer une réservation</h1>
        <p className="text-muted-foreground mt-1">
          {state?.roomName ? `Salle : ${state.roomName}` : 'Réservez une salle de réunion pour votre équipe'}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-strong rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Salle</Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Sélectionner une salle" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} className="pl-10 h-12" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-10 h-12" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-10 h-12" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold mt-2" disabled={loading}>
            {loading ? <LoadingSpinner size={20} /> : <><CalendarPlus size={18} className="mr-2" /> Créer la réservation</>}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Reserve;
