import React, { useState } from 'react';
import { Check, ChevronsUpDown, Eye, EyeOff, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Reusable Text Input Field
 */
export const FormInput = ({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  hideLabel = false,
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full relative ">
        {label && !hideLabel && (
          <FormLabel className="text-sm font-semibold">
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
        )}
        <FormControl>
          <Input
            type={type}
            placeholder={placeholder}
            className="h-10 md:h-11 text-sm md:text-base bg-slate-50 dark:bg-slate-900 border-slate-400 dark:border-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-600 dark:focus-visible:border-slate-400 transition-all"
            {...field}
          />
        </FormControl>
        <FormMessage className="text-[10px] absolute -bottom-4 left-0" />
      </FormItem>
    )}
  />
);

/**
 * Reusable Input Field with Left Icon
 */
export const FormIconInput = ({
  form,
  name,
  label,
  placeholder,
  icon: Icon,
  type = 'text',
  required = false,
  hideLabel = false,
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full relative ">
        {label && !hideLabel && (
          <FormLabel className="text-sm font-semibold">
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
        )}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {Icon && <Icon className="size-5" />}
          </div>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="h-11 pl-10 text-sm md:text-base bg-slate-50 dark:bg-slate-900 border-slate-400 dark:border-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-600 dark:focus-visible:border-slate-400 transition-all"
              {...field}
            />
          </FormControl>
        </div>
        <FormMessage className="text-[10px] absolute -bottom-4 left-0" />
      </FormItem>
    )}
  />
);

/**
 * Reusable Password Input Field with Toggle
 */
export const FormPasswordInput = ({
  form,
  name,
  label,
  placeholder,
  required = false,
  hideLabel = false,
  matchValue = null,
  showMatchIcon = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const fieldValue = form.watch(name);
  const isMatched = matchValue && fieldValue && fieldValue === matchValue;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="w-full relative ">
          {label && !hideLabel && (
            <FormLabel className="text-sm font-semibold">
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <div className="relative">
            <FormControl>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                className={cn(
                  "h-11 pr-10 text-sm md:text-base bg-slate-50 dark:bg-slate-900 border-slate-400 dark:border-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-600 dark:focus-visible:border-slate-400 transition-all",
                  isMatched && "border-green-500 focus-visible:border-green-600"
                )}
                {...field}
              />
            </FormControl>
            <div className="absolute right-0 top-0 h-full flex items-center pr-3 gap-2">
              {isMatched && showMatchIcon && (
                <div className="flex items-center justify-center size-5 rounded-full bg-green-500 text-white animate-in zoom-in duration-300">
                  <Check className="size-3 stroke-[3]" />
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-full px-1 py-2 hover:bg-transparent text-muted-foreground hover:text-hw-blue-dark dark:hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>
          {isMatched ? (
            <p className="text-[10px] absolute -bottom-4 left-0 text-green-600 font-medium flex items-center gap-1">
               Matched
            </p>
          ) : (
            <FormMessage className="text-[10px] absolute -bottom-4 left-0" />
          )}
        </FormItem>
      )}
    />
  );
};

/**
 * Reusable Select Field
 */
export const FormSelect = ({
  form,
  name,
  label,
  placeholder,
  options,
  required = false,
  hideLabel = false,
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full relative ">
        {label && !hideLabel && (
          <FormLabel className="text-sm font-semibold">
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
        )}
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className="h-10 md:h-11 text-sm md:text-base bg-slate-50 dark:bg-slate-900 border-slate-400 dark:border-slate-600 focus:ring-0 focus:ring-offset-0 focus:border-slate-600 dark:focus:border-slate-400 transition-all">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage className="text-[10px] absolute -bottom-4 left-0" />
      </FormItem>
    )}
  />
);

/**
 * Reusable Searchable Select Field (Single)
 */
export const FormSearchableSelect = ({
  form,
  name,
  label,
  placeholder,
  options,
  required = false,
  hideLabel = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col relative ">
          {label && !hideLabel && (
            <FormLabel className="text-sm font-semibold">
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-full h-11 text-sm justify-between bg-slate-50 dark:bg-slate-900 border-slate-400 dark:border-slate-600 focus:ring-0 focus:ring-offset-0 focus:border-slate-600 dark:focus:border-slate-400 transition-all font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value
                    ? options.find((opt) => opt.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={`Search ${label?.toLowerCase()}...`}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => {
                          field.onChange(opt.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            opt.value === field.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage className="text-[10px] absolute -bottom-4 left-0" />
        </FormItem>
      )}
    />
  );
};

/**
 * Reusable Multi-Select Field with Search
 */
export const FormMultiSelect = ({
  form,
  name,
  label,
  placeholder,
  options,
  maxItems = 5,
  required = false,
  hideLabel = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const values = Array.isArray(field.value) ? field.value : [];

        const toggleValue = (val) => {
          let newValues;
          if (values.includes(val)) {
            newValues = values.filter((v) => v !== val);
          } else if (values.length < maxItems) {
            newValues = [...values, val];
          } else {
            return; // Already reached max
          }
          field.onChange(newValues);
        };

        return (
          <FormItem className="w-full flex flex-col relative pb-9">
            {label && !hideLabel && (
              <FormLabel className="text-sm font-semibold">
                {label}{' '}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}

            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
              {values.map((val) => (
                <Badge
                  key={val}
                  variant="secondary"
                  className="gap-1 px-2 py-1"
                >
                  {options.find((opt) => opt.value === val)?.label || val}
                  <X
                    className="size-3 cursor-pointer hover:text-destructive transition-all"
                    onClick={() => toggleValue(val)}
                  />
                </Badge>
              ))}
              {values.length === 0 && (
                <span className="text-xs text-muted-foreground italic">
                  No items selected
                </span>
              )}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-full h-11 justify-between bg-slate-50 dark:bg-slate-900 border-slate-400 dark:border-slate-600 focus:ring-0 focus:ring-offset-0 focus:border-slate-600 dark:focus:border-slate-400 transition-all font-normal',
                      values.length >= maxItems &&
                        'opacity-50 cursor-not-allowed',
                    )}
                    disabled={values.length >= maxItems}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="size-4 opacity-50" />
                      <span>{placeholder}</span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder={`Search ${label?.toLowerCase()}...`}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-auto">
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={opt.label}
                          onSelect={() => toggleValue(opt.value)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              values.includes(opt.value)
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {opt.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage className="text-[10px] absolute bottom-4 left-0" />
            <p className="text-[10px] text-muted-foreground absolute -bottom-4 left-0">
              Select up to {maxItems} items.
            </p>
          </FormItem>
        );
      }}
    />
  );
};
/**
 * Standard Header for Signup Steps
 */
export const StepHeader = ({ title, subtitle, className }) => (
  <div className={cn("text-center w-full max-w-sm xl:max-w-md mx-auto mb-4 xl:mb-8", className)}>
    <h2 className="text-xl font-bold tracking-tight text-hw-blue-dark dark:text-white sm:text-2xl">
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm md:text-base text-slate-500 dark:text-slate-400  leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);
