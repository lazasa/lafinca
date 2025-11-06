'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export function useAuthenticatedFetch() {
  const { accessToken, refreshAccessToken } = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: FetchOptions = {}) => {
      const { skipAuth = false, ...fetchOptions } = options;

      if (skipAuth) {
        return fetch(url, fetchOptions);
      }

      if (!accessToken) {
        throw new Error('No hay token de acceso disponible');
      }

      const headers = new Headers(fetchOptions.headers);
      headers.set('Authorization', `Bearer ${accessToken}`);

      let response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        
        if (!refreshed) {
          throw new Error('No se pudo actualizar el token');
        }

        response = await fetch(url, {
          ...fetchOptions,
          headers,
        });
      }

      return response;
    },
    [accessToken, refreshAccessToken]
  );

  return authenticatedFetch;
}
