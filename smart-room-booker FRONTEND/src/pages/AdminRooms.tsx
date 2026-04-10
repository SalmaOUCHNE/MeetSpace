import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { roomService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getRoomImage } from '@/lib/roomImages';

interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string;
  image?: string;
}

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState({ name: '', capacity: '', equipment: '', image: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await roomService.getAll();
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', capacity: '', equipment: '', image: '' });
    setDialogOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setForm({ name: room.name, capacity: room.capacity.toString(), equipment: room.equipment, image: room.image || '' });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.capacity) {
      toast.error('Le nom et la capacité sont obligatoires');
      return;
    }
    setSaving(true);
    try {
      const data = { name: form.name, capacity: Number(form.capacity), equipment: form.equipment };
      if (editing) {
        await roomService.update(editing.id, data);
        toast.success('Salle mise à jour');
      } else {
        await roomService.create(data);
        toast.success('Salle créée');
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Opération échouée');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await roomService.delete(id);
      toast.success('Salle supprimée');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Échec de la suppression');
    }
  };

  if (loading) return <LoadingSpinner className="mt-32" text="Chargement des salles..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gérer les salles</h1>
          <p className="text-muted-foreground mt-1">Créer, modifier et supprimer les salles de réunion</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus size={18} className="mr-2" /> Ajouter une salle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier la salle' : 'Créer une salle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Nom de la salle</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ex: Salle Atlas" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Capacité</Label>
                <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="ex: 10" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Équipements</Label>
                <Input value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} placeholder="ex: Projecteur, Tableau blanc" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>URL de l'image (optionnel)</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="h-11" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? <LoadingSpinner size={18} /> : editing ? 'Modifier' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {rooms.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Aucune salle</p>
          <p className="text-sm">Créez votre première salle de réunion pour commencer.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/30">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Salle</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Capacité</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Équipements</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={getRoomImage(room.id, room.image)} alt={room.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        <span className="font-medium">{room.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users size={14} /> {room.capacity}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{room.equipment || '—'}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(room)}>
                          <Pencil size={14} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 size={14} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer la salle</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer <strong>{room.name}</strong> ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(room.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;