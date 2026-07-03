import { apiClient } from './axios';

export function fetcher<T>(url: string) {
  return apiClient.get<T>(url).then((response) => response.data);
}
