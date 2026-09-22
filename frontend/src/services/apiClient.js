import { supabase } from '@/database/supabaseClient';

const API_URL = 'http://localhost:5000/api';

export async function apiRequest(path, body) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  const response = await fetch(`${API_URL}${cleanPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || 'Request failed.');
  return result;
}