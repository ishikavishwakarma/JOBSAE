import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { StepHeader } from './form-fields';
import { useMemo } from 'react';

export function SubKeywordsStep({ form, options = [], parentOptions = [] }) {
  const selectedSubKeywords = form.watch('subKeywords') || [];

  // Group options by their groupId
  const groupedOptions = useMemo(() => {
    if (options.length === 0) return {};
    
    return options.reduce((acc, subKeyword) => {
      const groupId = subKeyword.groupId || 'other';
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(subKeyword);
      return acc;
    }, {});
  }, [options]);

  // Create a map to quickly look up parent names by their ID/groupId
  const parentNameMap = useMemo(() => {
    return parentOptions.reduce((acc, parent) => {
      const id = parent.groupId || parent.id;
      if (id) acc[id] = parent.name;
      return acc;
    }, {});
  }, [parentOptions]);

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
    <div className="space-y-8 flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StepHeader 
        title="Refine your skills" 
        subtitle="Select up to 10 specific skills in your chosen fields" 
      />

      <div className="w-full max-w-sm xl:max-w-md space-y-6">
        <FormField
          control={form.control}
          name="subKeywords"
          render={({ field }) => (
            <FormItem className="space-y-3">
              {Object.keys(groupedOptions).length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  No sub-keywords available for your selection.
                </div>
              ) : (
                Object.entries(groupedOptions).map(([groupId, items]) => {
                  const groupName = parentNameMap[groupId] || 'Other Skills';
                  
                  return (
                    <div key={groupId} className="bg-white dark:bg-slate-900/40 p-3 ">
                      <h3 className="text-[17px] font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        {groupName}
                      </h3>
                      
                      <div className="flex flex-wrap gap-3 sm:gap-4 pl-1">
                        {items.map((option) => {
                          const subKeywordName = typeof option === 'string' ? option : option.name;
                          const isSelected = selectedSubKeywords.some(k => (typeof k === 'string' ? k : k.name) === subKeywordName);
                          const isDisabled = !isSelected && selectedSubKeywords.length >= 10;
                          const label = subKeywordName;

                          return (
                            <Badge
                              key={typeof option === 'string' ? option : option.id || option.name}
                              variant={isSelected ? 'default' : 'outline'}
                              className={cn(
                                'px-3 py-2 text-[14px] font-medium cursor-pointer transition-all duration-200 gap-2 rounded-xl shadow-sm hover:shadow-md border',
                                isSelected 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 ' 
                                  : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400',
                                isDisabled && 'opacity-40 cursor-not-allowed scale-100 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-300'
                              )}
                              onClick={() => !isDisabled && toggleSubKeyword(option, field.onChange)}
                            >
                              {label}
                              {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
              <div className="text-center pt-2">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
