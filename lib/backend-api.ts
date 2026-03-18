const DEFAULT_BACKEND_API_URL = "https://store-omega-three-85.vercel.app";

export function getBackendApiUrl() {
  return (
    process.env.BACKEND_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.trim() ||
    DEFAULT_BACKEND_API_URL
  );
}
