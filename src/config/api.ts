// Central API URL configuration for Vite
// Use VITE_API_URL from environment at build time, fall back to localhost for dev
export const API_URL: string = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

export default API_URL;
