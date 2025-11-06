/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts (before any requests)
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeServer } = await import('./lib/config/init');
    initializeServer();
  }
}
