import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { reservationService, roomService } from '@/services/api';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { CalendarCheck, DoorOpen, TrendingUp, Users, CalendarPlus, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { getRoomImage } from '@/lib/roomImages';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ reservations: 0, rooms: 0, confirmed: 0 });
  const [recentRooms, setRecentRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const load = async () => {
    try {
      const reservationsCall = user?.role === 'ADMIN'
        ? reservationService.getAll()
        : reservationService.getMyReservations();

      const [reservations, rooms] = await Promise.all([
        reservationsCall,
        roomService.getAll(),
      ]);

      const resList = Array.isArray(reservations.data) ? reservations.data : [];
      const roomList = Array.isArray(rooms.data) ? rooms.data : [];

      setStats({
        reservations: resList.length,
        rooms: roomList.length,
        confirmed: resList.filter((r: any) => r.status === 'CONFIRMED').length,
      });

      setRecentRooms(roomList.slice(0, 3));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (user) load();
}, [user]);

  if (loading) return <LoadingSpinner className="mt-32" text="Chargement du tableau de bord..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/50" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground tracking-tight">
            Bienvenue, {user?.name} 
          </h1>
          <p className="text-primary-foreground/70 mt-2 max-w-lg">
  {user?.role === 'ADMIN'
    ? "Gérez les salles et consultez toutes les réservations des utilisateurs."
    : "Réservez une salle et gérez vos réservations facilement!"}
</p>
          <div className="flex gap-3 mt-6">
            <Button onClick={() => navigate('/rooms')} variant="secondary" className="font-semibold">
              <DoorOpen size={16} className="mr-2" /> Voir les salles
            </Button>
            {user?.role === 'ADMIN' ? (
  <Button
    onClick={() => navigate('/admin/reservations')}
    variant="outline"
    className="bg-primary-foreground/10 text-primary-foreground"
  >
   Voir les réservations
  </Button>
) : (
  <Button
    onClick={() => navigate('/reserve')}
    variant="outline"
    className="bg-primary-foreground/10 text-primary-foreground"
  >
    <CalendarPlus size={16} className="mr-2" />
    Réserver
  </Button>
)}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total réservations" value={stats.reservations} icon={CalendarCheck} color="primary" delay={0.1} />
        <StatCard title="Salles disponibles" value={stats.rooms} icon={DoorOpen} color="accent" delay={0.2} />
        <StatCard title="Confirmées" value={stats.confirmed} icon={TrendingUp} color="success" delay={0.3} />
        <StatCard title="Votre rôle" value={user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'} icon={Users} color="warning" delay={0.4} />
      </div>

      {/* Featured Rooms */}
      {recentRooms.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Salles en vedette</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/rooms')} className="text-primary">
              Voir tout <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentRooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                onClick={() => navigate(`/rooms/${room.id}`)}
                className="group cursor-pointer rounded-xl overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={getRoomImage(room.id, room.image)}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{room.capacity} personnes · {room.equipment || 'Standard'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
