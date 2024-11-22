import { z } from 'zod';

export const editUserSchema = z
  .object({
    // Username field
    username: z
      .string()
      .nonempty({ message: 'Username is required' }),

    // Email field
    email: z
      .string()
      .email({ message: 'Invalid email address' }),

    // Password field (optional)
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .optional(),

    // Confirm Password field (optional)
    confirmPassword: z.string().optional(),

    // Phone field
    phone: z
      .string()
      .regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' }),

    // Profile (file upload) field
    profile: z.any().optional(),
  })
  .refine(
    data => {
      // Only validate password match if password is provided
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords must match',
      path: ['confirmPassword'], // Error message displayed for confirmPassword
    }
  );
