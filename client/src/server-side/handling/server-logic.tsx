// services/auth.ts
import { supabase } from '../../services/supabase-client';

const rolesMap: Record<string, number> = {
  buyer: 1,
  farmer: 2,
};

export const registerUser = async (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'buyer' | 'farmer';
}) => {
  try {
    
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`, 
      },
    });

    if (error) throw error;
    if (!data.user?.id) throw new Error('User creation failed');


    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: `${formData.firstName} ${formData.lastName}`,
      role_id: rolesMap[formData.userType],
    });

    if (profileError) throw profileError;

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Registration failed' };
  }
};
