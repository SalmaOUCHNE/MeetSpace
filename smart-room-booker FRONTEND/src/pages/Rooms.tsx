import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { roomService } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, Users, Monitor, CalendarPlus, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoomImage, parseEquipment, MOCK_ROOMS } from '@/lib/roomImages';
import RoomStatusBadge from '@/components/RoomStatusBadge';
import { useRoomStatuses } from '@/hooks/useRoomStatuses';
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

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');

  const navigate = useNavigate();
  const roomIds = useMemo(() => rooms.map((r) => r.id), [rooms]);
  const statuses = useRoomStatuses(roomIds);

  
  useEffect(() => {
    roomService.getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];

        if (data.length > 0) {
          setRooms(data);
        } else {
          console.log("API vide → utilisation MOCK_ROOMS");
          setRooms(MOCK_ROOMS);
        }
      })
      .catch((err) => {
        console.log("Erreur API → utilisation MOCK_ROOMS", err);
        setRooms(MOCK_ROOMS);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.equipment.toLowerCase().includes(search.toLowerCase());

    const matchesCapacity =
      capacityFilter === 'all' ||
      (capacityFilter === 'small' && r.capacity <= 4) ||
      (capacityFilter === 'medium' && r.capacity > 4 && r.capacity <= 10) ||
      (capacityFilter === 'large' && r.capacity > 10);

    const matchesEquipment =
      equipmentFilter === 'all' ||
      r.equipment.toLowerCase().includes(equipmentFilter.toLowerCase());

    return matchesSearch && matchesCapacity && matchesEquipment;
  });

  if (loading) return <LoadingSpinner className="mt-32" text="Chargement des salles..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Salles de réunion</h1>
        <p className="text-muted-foreground">Parcourez et réservez les salles disponibles</p>
      </motion.div>

      {/* 🔎 Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={capacityFilter} onValueChange={setCapacityFilter}>
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal size={14} className="mr-2" />
            <SelectValue placeholder="Capacité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="small">1-4</SelectItem>
            <SelectItem value="medium">5-10</SelectItem>
            <SelectItem value="large">10+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/*  Rooms */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Monitor size={30} className="mx-auto" />
          <p>Aucune salle trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl overflow-hidden border bg-card hover:shadow-lg transition"
            >

              {/* Image */}
              <div onClick={() => navigate(`/rooms/${room.id}`)} className="cursor-pointer relative">
                <img
                  src={getRoomImage(room.id, room.image)}
                  className="w-full h-48 object-cover"
                />
                <RoomStatusBadge status={statuses[room.id] || 'available'} className="absolute top-2 left-2" />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{room.name}</h3>
                  <Badge><Users size={12} /> {room.capacity}</Badge>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {parseEquipment(room.equipment).map((eq) => (
                    <span key={eq} className="text-xs bg-gray-100 px-2 rounded">{eq}</span>
                  ))}
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={() =>
                    navigate('/reserve', { state: { roomId: room.id } })
                  }
                >
                  <CalendarPlus size={14} className="mr-2" />
                  Réserver
                </Button>
              </div>

            </motion.div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Rooms;