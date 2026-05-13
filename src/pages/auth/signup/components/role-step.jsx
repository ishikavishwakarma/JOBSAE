import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { StepHeader } from './form-fields';
import { Briefcase, User, CheckCircle2 } from 'lucide-react';

export function RoleStep({ form, config }) {
  const roles = [
    {
      id: 'jobseeker',
      title: 'Job Seeker',
      subtitle: 'I am a Job Seeker',
      description: 'Search for jobs, apply to top companies, and build your professional career.',
      icon: User,
    },
    {
      id: 'employer',
      title: 'Employer',
      subtitle: 'I am an Employer',
      description: 'Post jobs, find high-quality candidates, and manage your hiring process easily.',
      icon: Briefcase,
    },
  ];

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <StepHeader 
        title={config?.title} 
        subtitle={config?.subtitle} 
      />

      <div className="w-full max-w-md">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = field.value === role.id;
                  return (
                    <Card
                      key={role.id}
                      className={cn(
                        'relative cursor-pointer transition-all duration-300 border-2',
                        isSelected
                          ? 'border-primary bg-primary/[0.03] shadow-md ring-1 ring-primary/20'
                          : 'border hover:border-primary/40 bg-muted/30'
                      )}
                      onClick={() => field.onChange(role.id)}
                    >
                      {/* Selection Checkmark */}
                      <div className={cn(
                        "absolute top-4 right-4 transition-all duration-300",
                        isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      )}>
                        <CheckCircle2 className="size-5 fill-primary text-white" />
                      </div>

                      <CardContent className="p-6 flex items-start gap-5">
                        <div
                          className={cn(
                            'size-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300',
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                              : 'bg-background text-muted-foreground border-muted-foreground/20'
                          )}
                        >
                          <Icon className="size-6" />
                        </div>

                        <div className="flex flex-col space-y-1 pr-6 text-left">
                          <span className={cn(
                            "text-[10px] font-extrabold uppercase tracking-widest transition-colors",
                            isSelected ? "text-hw-orange" : "text-muted-foreground"
                          )}>
                            {role.subtitle}
                          </span>
                          <h3 className="font-bold text-lg leading-tight">
                            {role.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                            {role.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
