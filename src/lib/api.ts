import { client } from '../api'; // Ce dossier est généré par npm run generate-api
import { useAuthStore } from '../store/authStore';

client.setConfig({
  baseUrl: 'http://localhost:3000/api',
});

// Intercepteur pour injecter le Token JWT
client.interceptors.request.use((request) => {
  const token = useAuthStore.getState().token;
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});