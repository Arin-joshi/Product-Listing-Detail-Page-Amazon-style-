export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const baseUrl = 'https://dummyjson.com';
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
};
