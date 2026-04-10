import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning';
  delay?: number;
}

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

const LoadingSpinnerComponent = ({ title, value, icon: Icon, trend, color = 'primary', delay = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-strong rounded-xl p-5 md:p-6 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-xs md:text-sm font-medium text-muted-foreground">{title}</p>
     <p className="text-lg md:text-xl font-bold tracking-tight break-words max-w-[140px]">
  {value}
</p>
        {trend && <p className="text-xs text-success font-medium">{trend}</p>}
      </div>
      <div className={cn("p-2.5 md:p-3 rounded-xl", colorMap[color])}>
        <Icon size={20} />
      </div>
    </div>
  </motion.div>
);

export default LoadingSpinnerComponent;
