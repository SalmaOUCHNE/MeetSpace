import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import logo from '@/assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      login(res.data.token, res.data.user || res.data);
      toast.success('Bienvenue !');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[hsl(222,47%,11%)] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,47%,11%)] via-[hsl(222,47%,15%)] to-primary/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-white max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="MeetSpace" className="w-16 h-16 rounded-xl" />
  <span className="text-white text-3xl font-semibold tracking-wide">
  Meet<span className="text-blue-300">Space</span>
</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Réservation de Salles<br />de Réunion
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Réservez facilement vos salles de réunion, évitez les conflits et gardez votre équipe productive.
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <img src={logo} alt="MeetSpace" className="w-12 h-12 rounded-lg" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2">Bon retour parmi nous</h1>
          <p className="text-muted-foreground mb-8">Entrez vos identifiants pour accéder à votre compte</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12" />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? <LoadingSpinner size={20} /> : <>Se connecter <ArrowRight size={18} /></>}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Créer un compte</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
