import { useEffect, useState } from 'react';
import { apiClient } from '../api/axios';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await apiClient.get('/auth/session');
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { isAuthenticated, loading };
}
