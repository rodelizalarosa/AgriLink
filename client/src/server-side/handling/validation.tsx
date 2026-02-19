import type { RegisterFormData, RegisterFormErrors } from '../../types';
import { supabase } from '../../services/supabase-client';

export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string) =>
  password.length >= 8;

export const validateForm = (formData: RegisterFormData): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  if (!formData.firstName)
    errors.firstName = 'First name is required';

  if (!formData.lastName)
    errors.lastName = 'Last name is required';

  if (!formData.email)
    errors.email = 'Email is required';
  else if (!validateEmail(formData.email))
    errors.email = 'Invalid email';

  if (!formData.password)
    errors.password = 'Password is required';
  else if (!validatePassword(formData.password))
    errors.password = 'Password too short';

  if (!formData.confirmPassword)
    errors.confirmPassword = 'Please confirm your password';
  else if (formData.password !== formData.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';

  if (!formData.agreeToTerms)
    errors.agreeToTerms = 'You must agree to the terms';
  return errors;
};


export const checkEmailAvailability = async (email: string) => {
  if (!email || !validateEmail(email)) return undefined;

  const { data } = await supabase
    .from('users_table')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (data) {
    return 'This email is already registered';
  }

  return undefined;
};
