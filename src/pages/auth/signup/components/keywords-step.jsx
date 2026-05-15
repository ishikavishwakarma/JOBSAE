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
    <div className="space-y-8 flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StepHeader 
        title="What's your field?" 
        subtitle="Select up to 5 areas of expertise" 
      />

      <div className="w-full  max-w-sm xl:max-w-md bg-white dark:bg-slate-900/40 p-6 ">
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {keywordOptions.map((option) => {
                  const keywordName = typeof option === 'string' ? option : option.name;
                  const isSelected = selectedKeywords.some(k => (typeof k === 'string' ? k : k.name) === keywordName);
                  const isDisabled = !isSelected && selectedKeywords.length >= 5;
                  const label = keywordName;

                  return (
                    <Badge
                      key={typeof option === 'string' ? option : option.id || option.name}
                      variant={isSelected ? 'default' : 'outline'}
                      className={cn(
                        'px-3 py-2.5 text-[14px] sm:text-[15px] font-medium cursor-pointer transition-all duration-200 gap-2 rounded-xl shadow-sm hover:shadow-md border',
                        isSelected 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 ' 
                          : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400',
                        isDisabled && 'opacity-40 cursor-not-allowed scale-100 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-300'
                      )}
                      onClick={() => !isDisabled && toggleKeyword(option, field.onChange)}
                    >
                      {label}
                      {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                    </Badge>
                  );
                })}
              </div>
              <div className="text-center pt-4">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
