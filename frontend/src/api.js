// Centralized API base URL and fetch helper

export function getBaseUrl() {
  return 'https://onevote-ehcy.onrender.com';
}

export async function apiFetch(endpoint, options = {}) {
  const url = `${getBaseUrl()}${endpoint}`;
  return fetch(url, options);
} 