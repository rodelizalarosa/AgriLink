import { supabase } from '../../services/supabase-client';

export interface ProfilePayload {
  userId: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export async function createProfile(payload: ProfilePayload) {
  const { data, error } = await supabase.from('users_table').insert({
    id: payload.userId,
    u_fname: payload.firstName,
    u_lname: payload.lastName,
    role_id: payload.roleId,
  });

  if (error) throw new Error(error.message);
  return data;
}
