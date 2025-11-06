/**
 * Server initialization
 * Runs validation checks when the server starts
 */

import { validateEnvOrThrow, printEnvStatus } from './validateEnv';

let initialized = false;

/**
 * Initialize server - runs once on startup
 */
export function initializeServer() {
  // Only run once
  if (initialized) return;

  console.log('\n🚀 Initializing ToolBox Server...\n');

  try {
    // Validate environment variables
    validateEnvOrThrow();

    // Print environment status in development
    if (process.env.NODE_ENV === 'development') {
      printEnvStatus();
    }

    initialized = true;
    console.log('✅ Server initialization complete\n');
  } catch (error) {
    console.error('\n❌ Server initialization failed:', error);
    throw error;
  }
}

// Auto-run on server (not in browser)
if (typeof window === 'undefined') {
  initializeServer();
}
