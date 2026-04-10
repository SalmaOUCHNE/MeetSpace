import { useState } from 'react';
import { motion } from 'framer-motion';
import { roomService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, Users, CalendarDays, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoomStatusBadge from '@/components/RoomStatusBadge';
import { getRoomImage, parseEquipment } from '@/lib/roomImages';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string;
  image?: string;
}

const AvailableRooms = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    if (date < today) {
      toast.error('Impossible de rechercher dans le passé');
      return;
    }
    if (startTime >= endTime) {
      toast.error('L\'heure de début doit être avant l\'heure de fin');
      return;
    }
    setLoading(true);
    try {
      const res = await roomService.getAvailable(date, startTime, endTime);
      setRooms(Array.isArray(res.data) ? res.data : []);
      setSearched(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Échec de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const filtered = rooms.filter((r) => {
    const matchesCapacity =
      capacityFilter === 'all' ||
      (capacityFilter === 'small' && r.capacity <= 4) ||
      (capacityFilter === 'medium' && r.capacity > 4 && r.capacity <= 10) ||
      (capacityFilter === 'large' && r.capacity > 10);
    const matchesEquipment =
      equipmentFilter === 'all' ||
      r.equipment.toLowerCase().includes(equipmentFilter.toLowerCase());
    return matchesCapacity && matchesEquipment;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Rechercher des salles disponibles</h1>
        <p className="text-muted-foreground mt-1">Trouvez une salle disponible selon vos critères</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border/60 shadow-sm p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>Date</Label>
              <div className="relative">
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} className="pl-10 h-11" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Heure de début</Label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-10 h-11" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Heure de fin</Label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-10 h-11" />
              </div>
            </div>
            <Button type="submit" className="h-11 px-6" disabled={loading}>
              {loading ? <LoadingSpinner size={18} /> : <><Search size={16} className="mr-2" /> Rechercher</>}
            </Button>
          </div>

          {/* Extra filters */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border/40">
            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Capacité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes tailles</SelectItem>
                <SelectItem value="small">Petite (1-4)</SelectItem>
                <SelectItem value="medium">Moyenne (5-10)</SelectItem>
                <SelectItem value="large">Grande (10+)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger className="w-[200px] h-10">
                <SelectValue placeholder="Équipement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tout équipement</SelectItem>
                <SelectItem value="TV">TV</SelectItem>
                <SelectItem value="Projecteur">Projecteur</SelectItem>
                <SelectItem value="Tableau blanc">Tableau blanc</SelectItem>
                <SelectItem value="Vidéoconférence">Vidéoconférence</SelectItem>
                <SelectItem value="WiFi">WiFi</SelectItem>
                <SelectItem value="Micro">Micro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </motion.div>

      {searched && (
        filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">Aucune salle disponible trouvée</p>
            <p className="text-sm">Essayez une autre date, un autre créneau ou modifiez vos filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden cursor-pointer relative" onClick={() => navigate(`/rooms/${room.id}`)}>
                  <RoomStatusBadge status="available" className="absolute top-3 left-3 shadow-md z-10" />
                  <img src={getRoomImage(room.id, room.image)} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{room.name}</h3>
                    <Badge variant="secondary" className="text-xs"><Users size={12} className="mr-1" />{room.capacity}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {parseEquipment(room.equipment).slice(0, 3).map((eq) => (
                      <span key={eq} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{eq}</span>
                    ))}
                  </div>
                  <Button onClick={() => navigate('/reserve', { state: { roomId: room.id, roomName: room.name } })} className="w-full" size="sm">
                    Réserver maintenant
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default AvailableRooms;