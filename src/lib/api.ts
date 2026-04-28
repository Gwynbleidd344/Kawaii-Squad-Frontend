// src/lib/api.ts
import { client } from "../api/client.gen"; 
import { useAuthStore } from '../store/authStore';

// Configuration du client généré par OpenAPI-TS
client.setConfig({
  baseUrl: 'http://localhost:3000', // Correspond aux chemins /api/... du YAML
});

// Injection automatique du Token JWT
client.interceptors.request.use((request) => {
  const token = useAuthStore.getState().token;
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

/**
 * Fonction utilitaire pour les appels manuels (ex: Register avec photo)
 */
export async function apiRequest(endpoint: string, options: any = {}) {
  const token = useAuthStore.getState().token;
  
  const headers = new Headers(options.headers || {});
  
  // Si ce n'est pas du FormData (photo), on ajoute le JSON par défaut
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}