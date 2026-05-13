import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { StepHeader } from './form-fields';

export function KeywordsStep({ form, options = [] }) {
  const keywordOptions = options.length > 0 ? options : [
    'Technology',
    'Marketing',
    'Finance',
    'Healthcare',
    'Education',
    'Design',
    'Sales',
    'Management',
    'Engineering',
    'Data Science',
  ];

  const selectedKeywords = form.watch('keywords') || [];

  const toggleKeyword = (keyword, onChange) => {
    const keywordName = typeof keyword === 'string' ? keyword : keyword.name;
    const currentValues = selectedKeywords.map(k => typeof k === 'string' ? k : k.name);
    
    if (currentValues.includes(keywordName)) {
      onChange(selectedKeywords.filter((k) => (typeof k === 'string' ? k : k.name) !== keywordName));
    } else if (selectedKeywords.length < 5) {
      onChange([...selectedKeywords, keyword]);
    }
  };

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <StepHeader 
        title="Select Keywords" 
        subtitle="Choose up to 5 keywords that describe your interests" 
      />

      <div className="w-full max-w-md">
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-center">
                {keywordOptions.map((option) => {
                  const keywordName = typeof option === 'string' ? option : option.name;
                  const isSelected = selectedKeywords.some(k => (typeof k === 'string' ? k : k.name) === keywordName);
                  const isDisabled = !isSelected && selectedKeywords.length >= 5;
                  const label = keywordName;

                  return (
                    <Badge
                      key={typeof option === 'string' ? option : option.id || option.name}
                      variant={isSelected ? 'primary' : 'outline'}
                      className={cn(
                        'px-4 py-2 text-sm cursor-pointer transition-all gap-2 h-10',
                        isSelected && 'border border-white ',
                        isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => !isDisabled && toggleKeyword(option, field.onChange)}
                    >
                      {label}
                      {isSelected && <Check className="size-3" />}
                    </Badge>
                  );
                })}
              </div>
              <div className="text-center">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
