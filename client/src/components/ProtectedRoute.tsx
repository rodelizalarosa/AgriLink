import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase-client';

interface Props {
  children: React.ReactNode;
  allowedRoles?: number[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const { data: userData } = await supabase
        .from('users_table')
        .select('role_id')
        .eq('id', userId)
        .single();

      if (!userData) {
        setAuthorized(false);
      } else if (!allowedRoles || allowedRoles.includes(userData.role_id)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, [allowedRoles]);

  if (loading) return null;

  if (!authorized) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
