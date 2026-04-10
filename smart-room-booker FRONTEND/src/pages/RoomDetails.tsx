import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { roomService, reservationService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoomStatusBadge from '@/components/RoomStatusBadge';
import { useRoomStatuses } from '@/hooks/useRoomStatuses';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getRoomImage, parseEquipment } from '@/lib/roomImages';
import {
  Users, ArrowLeft, CalendarPlus, Clock, CalendarDays, MapPin, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string;
  description?: string;
  image?: string;
}

const RoomDetails = () => {
  // ✅ FIX: useAuth داخل component
  const { isAdmin } = useAuth();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reserving, setReserving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // ✅ LOAD ROOM
  useEffect(() => {
    if (!id) return;

    roomService.getById(Number(id))
      .then((res) => setRoom(res.data))
      .catch(() => {
        toast.error('Salle introuvable');
        setRoom(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ hooks always before return
  const roomIds = room?.id ? [room.id] : [];
  const statuses = useRoomStatuses(roomIds);

  // ✅ SAFE
  const equipmentList = room ? parseEquipment(room.equipment) : [];

  // ✅ RESERVE (غير ل USER)
  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (date < today) {
      toast.error('Impossible de réserver dans le passé');
      return;
    }

    if (startTime >= endTime) {
      toast.error("L'heure de fin doit être après l'heure de début");
      return;
    }

    setReserving(true);
    try {
      await reservationService.create({
        roomId: Number(id),
        date,
        startTime,
        endTime
      });

      toast.success('Réservation créée avec succès !');
      setDate('');
      setStartTime('');
      setEndTime('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setReserving(false);
    }
  };

  // ✅ LOADING
  if (loading) {
    return <LoadingSpinner className="mt-32" text="Chargement..." />;
  }

  // ✅ NOT FOUND
  if (!room) {
    return (
      <div className="text-center py-20">
        <p>Salle introuvable</p>
        <Button onClick={() => navigate('/rooms')}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* BACK */}
      <Button onClick={() => navigate('/rooms')}>
        <ArrowLeft size={16} /> Retour
      </Button>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-3 space-y-5">

          <img
            src={getRoomImage(room.id, room.image)}
            alt={room.name}
            className="rounded-xl"
          />

          <div className="p-6 border rounded-xl space-y-4">

            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">{room.name}</h1>
              <RoomStatusBadge status={statuses?.[room.id] || 'available'} />
            </div>

            <p className="flex items-center gap-2">
              <Users size={16} /> {room.capacity} personnes
            </p>

            {/* EQUIPMENT */}
            <div>
              <h3 className="font-semibold">Équipements</h3>
              {equipmentList.length > 0 ? (
                equipmentList.map((eq) => (
                  <div key={eq} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={14} className="text-green-500" /> {eq}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucun équipement</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">
                {room.description || "Aucune description disponible"}
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">

          {/* 👇 ADMIN */}
          {isAdmin ? (
            <div className="border p-6 rounded-xl">
              <h2 className="font-bold mb-4">Gestion</h2>

              <Button
                className="w-full"
                onClick={() => navigate('/admin/reservations')}
              >
                 Consulter les réservations
              </Button>
            </div>
          ) : (
            /* 👇 USER */
            <form onSubmit={handleReserve} className="space-y-4 border p-6 rounded-xl">

              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

              <Label>Début</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

              <Label>Fin</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

              <Button type="submit" disabled={reserving} className="w-full">
                {reserving ? <LoadingSpinner size={20} /> : "Réserver maintenant"}
              </Button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default RoomDetails;
