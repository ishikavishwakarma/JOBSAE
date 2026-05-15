import React, { useMemo } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicForm } from './dynamic-form';
import { StepHeader } from './form-fields';

export function PasswordStep({ form, config }) {
  const password = form.watch('password') || '';
  const confirmPassword = form.watch('confirmPassword') || '';

  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const allValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const checkItems = [
    { label: "Minimum 8 characters", isValid: passwordChecks.length },
    { label: "At least one uppercase letter (A–Z)", isValid: passwordChecks.uppercase },
    { label: "At least one lowercase letter (a–z)", isValid: passwordChecks.lowercase },
    { label: "At least one number (0–9)", isValid: passwordChecks.digit },
    { label: "At least one special character (!, @, #, etc.)", isValid: passwordChecks.specialChar },
  ];

  const passwordFields = [
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      placeholder: '••••••••',
      required: true
    }
  ];

  const confirmFields = [
    {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: '••••••••',
      required: true,
      matchValue: password,
      showMatchIcon: true
    }
  ];

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <StepHeader 
        title={config?.title} 
        subtitle={config?.subtitle} 
      />

      <div className="space-y-3 xl:space-y-6 max-w-md lg:max-w-sm xl:max-w-md mx-auto w-full">
          <DynamicForm fields={passwordFields} form={form} />
          <DynamicForm fields={confirmFields} form={form} />
        

        <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm transition-all duration-300">
         
          <div className="grid grid-cols-1 lg:gap-1 xl:gap-3">
            {checkItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 text-xs transition-all duration-300",
                  item.isValid ? "text-slate-900 dark:text-slate-100 font-semibold translate-x-1" : "text-slate-400 dark:text-slate-500"
                )}
              >
                <div className={cn(
                  "size-5 rounded-lg flex items-center justify-center border transition-all duration-500",
                  item.isValid 
                    ? "bg-hw-blue-dark border-hw-blue-dark text-white rotate-0 shadow-md" 
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 rotate-45"
                )}>
                  {item.isValid ? <Check className="size-3 stroke-[3]" /> : <ShieldCheck className="size-3" />}
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
