import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className }) => {
  return (
    <div className={cn("mb-8 text-center md:text-left", className)}>
      <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
