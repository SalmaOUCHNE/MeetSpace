import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  size?: number;
  text?: string;
}

const LoadingSpinner = ({ className, size = 24, text }: Props) => (
  <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
    <Loader2 size={size} className="animate-spin text-primary" />
    {text && <p className="text-sm text-muted-foreground">{text}</p>}
  </div>
);

export default LoadingSpinner;
