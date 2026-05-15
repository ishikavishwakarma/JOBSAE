import { z } from 'zod';

export const getSignupSchema = (step = 'all', isSocial = false) => {
  const baseSchema = {
    email: z
      .string()
      .email({ message: 'Please enter a valid email address.' })
      .min(1, { message: 'Email is required.' }),
    password: isSocial 
      ? z.string().optional()
      : z
        .string()
        .min(8, { message: 'Password must be at least 8 characters.' })
        .regex(/[A-Z]/, {
          message: 'At least one uppercase letter (A–Z)',
        })
        .regex(/[a-z]/, {
          message: 'At least one lowercase letter (a–z)',
        })
        .regex(/[0-9]/, {
          message: 'At least one number (0–9)',
        })
        .regex(/[^A-Za-z0-9]/, {
          message: 'At least one special character (!, @, #, etc.)',
        }),
    confirmPassword: isSocial 
      ? z.string().optional()
      : z.string().min(1, { message: 'Please confirm your password.' }),
    role: z.enum(['jobseeker', 'employer'], {
      required_error: 'Please select a role.',
    }),
    salutation: z.string().optional(),
    firstName: z.string().min(1, { message: 'First name is required.' }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: 'Last name is required.' }),
    companyName: z.string().optional(),
    suffix: z.string().optional(),
    keywords: z
      .array(z.any())
      .min(1, { message: 'Select at least one keyword.' })
      .max(5, { message: 'You can select up to 5 keywords.' })
      .optional()
      .or(z.literal([])),
    subKeywords: z
      .array(z.any())
      .min(1, { message: 'Select at least one sub-keyword.' })
      .max(10, { message: 'You can select up to 10 sub-keywords.' })
      .optional()
      .or(z.literal([])),
    stateCity: z.string().optional(),
    country: z.string().optional(),
    terms: z.boolean().optional(),
  };

  // If we are on the first signup page, we don't want to enforce onboarding fields
  if (step === 'signup') {
    const schema = z.object(baseSchema);
    if (isSocial) return schema;
    
    return schema.refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
  }

  // Full schema with requirements for onboarding
  const fullSchema = z.object({
    ...baseSchema,
    keywords: z
      .array(z.any())
      .min(1, { message: 'Select at least one keyword.' })
      .max(5, { message: 'You can select up to 5 keywords.' }),
    subKeywords: z
      .array(z.any())
      .min(1, { message: 'Select at least one sub-keyword.' })
      .max(10, { message: 'You can select up to 10 sub-keywords.' }),
    stateCity: z.string().min(1, { message: 'State and City are required.' }),
    country: z.string().min(1, { message: 'Country is required.' }),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions.',
    }),
  });

  if (isSocial) return fullSchema;

  return fullSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
};
