import { ApiClientCore } from './api.core';

const baseURL = process.env.NEXT_PUBLIC_API_URL!;

export const api = new ApiClientCore(baseURL, {
  'Content-Type': 'application/json',
});
