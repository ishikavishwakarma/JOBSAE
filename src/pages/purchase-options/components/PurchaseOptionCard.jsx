import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const isSubscription = type?.toLowerCase() === 'subscription';

  return (
    <Card 
      className={cn(
        'group relative xl:w-74 border-primary/50 flex flex-col h-full transition-all duration-300 bg-card hover:border-primary/40 hover:shadow-lg',
        isPopular && 'border-primary shadow-md ring-2 ring-primary/10',
        className
      )}
    >
      {/* Corner Ribbon Popular UI */}
      {isPopular && (
        <div className="absolute -top-2 -left-2 bg-red-700 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-tr-md rounded-bl-md shadow-md z-10">
          Most Popular
        </div>
      )}

      {/* Centered Header Section */}
      <div className="flex flex-col items-center justify-center px-5 pt-6 pb-1 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-2">
          {type} 
        </span>
        <h3 className="text-2xl -mt-1 font-semibold tracking-tight text-foreground  transition-colors">
          {title}
        </h3>
      </div>

      <CardHeader className="px-5 py-2 space-y-0.5 text-center">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="xl:text-5xl text-4xl font-semibold tracking-tighter text-foreground">
            {amount.split(' ')[1]}
          </span>
          <span className="text-xs font-bold text-muted-foreground uppercase">{amount.split(' ')[0]}</span>
        </div>
        <p className="text-xs text-muted-foreground font-bold italic mt-2">{line1}</p>
      </CardHeader>
      
      <CardContent className="px-6 py-2 flex-grow flex flex-col gap-6">
          {/* {description && (
            <p className="text-[13px] font-medium text-foreground/80 leading-relaxed py-3 px-4 bg-muted/40 rounded-xl border border-border/20 text-center">
              {description}
            </p>
          )} */}

        <div className="space-y-1 pt-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 text-[14px] text-muted-foreground group/item">
              <div className="mt-1 flex-shrink-0">
                <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-primary" strokeWidth={4} />
                </div>
              </div>
              <span className="leading-snug font-medium group-hover/item:text-foreground transition-colors">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-4 pt-2">
        <Button 
          onClick={() => navigate('/cart')}
          className={cn(
            "w-full h-10 font-semibold text-base  transition-all duration-300 rounded-xl",
            isPopular 
              ? "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20" 
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
          )}
        >
          <span>{buttonText}</span>
          <ShoppingCart className="ml-2 h-4 w-4" strokeWidth={2.5} />
        </Button>
      </CardFooter>

      {/* Decorative hover line at bottom */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full rounded-b-xl" />
    </Card>
  );
}
