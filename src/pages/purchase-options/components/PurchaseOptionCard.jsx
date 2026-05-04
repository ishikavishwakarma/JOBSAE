import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ShoppingCart, Briefcase, Building, Building2, Zap } from 'lucide-react';

export function PurchaseOptionCard({ 
  type, 
  title, 
  line1, 
  amount, 
  duration, 
  buttonText = 'Add to Cart', 
  description, 
  features = [],
  isPopular = false,
  className 
}) {
  const isSubscription = type?.toLowerCase() === 'subscription';

  const getPlanIcon = () => {
    const size = "h-5 w-5";
    if (title.toLowerCase().includes('small')) return <Briefcase className={cn(size, "text-blue-500")} />;
    if (title.toLowerCase().includes('midsize')) return <Building className={cn(size, "text-purple-500")} />;
    if (title.toLowerCase().includes('large')) return <Building2 className={cn(size, "text-amber-500")} />;
    return <Zap className={cn(size, "text-emerald-500")} />;
  };

  return (
    <Card 
      className={cn(
        'group relative flex flex-col h-full transition-all duration-300 border-border/60 bg-card hover:border-primary/40 hover:shadow-lg',
        isPopular && 'border-primary/50 shadow-md ring-1 ring-primary/10',
        className
      )}
    >
      {/* Header with Type and Icon */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "p-2 rounded-lg bg-muted/50 border border-border/40",
            isPopular && "bg-primary/5 border-primary/10"
          )}>
            {getPlanIcon()}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              {type} {isSubscription && `• ${duration || 'mo'}`}
            </span>
          </div>
        </div>
        {isPopular && (
          <Badge variant="primary" className="h-5 px-2 text-[9px] uppercase font-bold tracking-tighter">
            Popular
          </Badge>
        )}
      </div>

      <CardHeader className="px-5 py-3 space-y-0.5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black tracking-tighter">
            {amount.split(' ')[1]}
          </span>
          <span className="text-xs font-bold text-muted-foreground uppercase">{amount.split(' ')[0]}</span>
        </div>
        <p className="text-xs text-muted-foreground font-semibold italic">{line1}</p>
      </CardHeader>
      
      <CardContent className="px-5 py-4 flex-grow flex flex-col gap-5">
        {description && (
          <p className="text-xs font-medium text-foreground/70 leading-relaxed py-2 px-3 bg-muted/30 rounded-md border border-border/30">
            {description}
          </p>
        )}

        <div className="space-y-2.5">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2.5 text-[13px] text-muted-foreground group/item">
              <div className="mt-0.5 flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
              </div>
              <span className="leading-tight font-medium group-hover/item:text-foreground transition-colors">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-6 pt-2">
        <Button 
          className={cn(
            "w-full h-11 font-bold text-xs uppercase tracking-wider transition-all duration-200",
            isPopular ? "bg-primary hover:bg-primary/90" : "bg-foreground hover:bg-foreground/90 shadow-sm"
          )}
        >
          <span>{buttonText}</span>
          <ShoppingCart className="ml-2 h-3.5 w-3.5" strokeWidth={2.5} />
        </Button>
      </CardFooter>

      {/* Decorative hover line at bottom */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full rounded-b-xl" />
    </Card>
  );
}
