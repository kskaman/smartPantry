/**
 * Get the base URL for the application based on the environment
 * @returns The base URL (e.g., "https://your-app.com" or "http://localhost:3000")
 */
export function getBaseUrl(): string {
  // In production, use the NEXT_PUBLIC_APP_URL environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || '';
  }
  
  // In development, check if running on Vercel preview
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // Default to localhost for local development
  return 'http://localhost:3000';
}

/**
 * Check if the app is running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if the app is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Get the full URL for a given path
 * @param path - The path to append to the base URL (e.g., "/auth/callback")
 * @returns The full URL
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
