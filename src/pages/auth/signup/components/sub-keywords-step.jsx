import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { StepHeader } from './form-fields';

export function SubKeywordsStep({ form, options = [] }) {
  const subKeywordOptions = options.length > 0 ? options : [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'Content Strategy',
    'SEO',
    'Project Management',
    'Financial Analysis',
    'Accounting',
    'Software Architecture',
    'Machine Learning',
    'Cloud Computing',
    'Digital Marketing',
  ];

  const selectedSubKeywords = form.watch('subKeywords') || [];

  const toggleSubKeyword = (subKeyword, onChange) => {
    const subKeywordName = typeof subKeyword === 'string' ? subKeyword : subKeyword.name;
    const currentValues = selectedSubKeywords.map(k => typeof k === 'string' ? k : k.name);

    if (currentValues.includes(subKeywordName)) {
      onChange(selectedSubKeywords.filter((k) => (typeof k === 'string' ? k : k.name) !== subKeywordName));
    } else if (selectedSubKeywords.length < 10) {
      onChange([...selectedSubKeywords, subKeyword]);
    }
  };

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <StepHeader 
        title="Select Sub-keywords" 
        subtitle="Refine your interests with up to 10 sub-keywords" 
      />

      <div className="w-full max-w-md">
        <FormField
          control={form.control}
          name="subKeywords"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-center">
                {subKeywordOptions.map((option) => {
                  const subKeywordName = typeof option === 'string' ? option : option.name;
                  const isSelected = selectedSubKeywords.some(k => (typeof k === 'string' ? k : k.name) === subKeywordName);
                  const isDisabled = !isSelected && selectedSubKeywords.length >= 10;
                  const label = subKeywordName;

                  return (
                    <Badge
                      key={typeof option === 'string' ? option : option.id || option.name}
                      variant={isSelected ? 'primary' : 'outline'}
                      className={cn(
                        'px-4 py-2 text-sm cursor-pointer transition-all gap-2 h-10',
                        isSelected && 'border border-white ',
                         isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => !isDisabled && toggleSubKeyword(option, field.onChange)}
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
