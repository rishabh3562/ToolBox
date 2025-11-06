/**
 * Environment Variable Validation
 *
 * This module ensures all required environment variables are set before the app starts.
 * Helps catch configuration issues early rather than failing at runtime.
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that all required environment variables are set
 * @throws {Error} If critical environment variables are missing
 */
export function validateRequiredEnv(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical environment variables (required for app to function)
  const required = [
    { key: 'MONGODB_URI', description: 'MongoDB connection string' },
    { key: 'NEXTAUTH_URL', description: 'Base URL for NextAuth' },
    { key: 'NEXTAUTH_SECRET', description: 'Secret for JWT signing' },
    { key: 'ADMIN_EMAIL', description: 'Admin user email' },
    { key: 'ADMIN_PASSWORD', description: 'Admin user password' },
  ];

  // Check required variables
  for (const { key, description } of required) {
    if (!process.env[key]) {
      errors.push(`❌ Missing required variable: ${key} (${description})`);
    }
  }

  // Validate ADMIN_PASSWORD strength
  if (process.env.ADMIN_PASSWORD) {
    if (process.env.ADMIN_PASSWORD.length < 16) {
      errors.push('❌ ADMIN_PASSWORD must be at least 16 characters long for security');
    }

    // Warn about default/weak passwords
    const weakPasswords = ['admin123', 'password', '123456', 'changeme'];
    if (weakPasswords.includes(process.env.ADMIN_PASSWORD.toLowerCase())) {
      errors.push('❌ ADMIN_PASSWORD is too weak. Please use a strong, random password');
    }
  }

  // Validate NEXTAUTH_SECRET length
  if (process.env.NEXTAUTH_SECRET) {
    if (process.env.NEXTAUTH_SECRET.length < 32) {
      warnings.push('⚠️  NEXTAUTH_SECRET should be at least 32 characters long');
    }
  }

  // Production-specific checks
  if (process.env.NODE_ENV === 'production') {
    // Redis is required for rate limiting in production
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      warnings.push(
        '⚠️  Redis not configured (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)\n' +
        '   Rate limiting will not work properly in multi-instance deployments.\n' +
        '   See: https://upstash.com for setup instructions'
      );
    }

    // Check for localhost URLs in production
    if (process.env.NEXTAUTH_URL?.includes('localhost')) {
      errors.push('❌ NEXTAUTH_URL cannot use localhost in production');
    }

    if (process.env.MONGODB_URI?.includes('localhost') || process.env.MONGODB_URI?.includes('127.0.0.1')) {
      errors.push('❌ MONGODB_URI cannot use localhost in production. Use MongoDB Atlas or remote instance.');
    }
  }

  // Check for development-specific warnings
  if (process.env.NODE_ENV === 'development') {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      warnings.push(
        '⚠️  Redis not configured - using in-memory rate limiting (development only)\n' +
        '   This is OK for development but will not work in production'
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates environment and throws if critical issues found
 */
export function validateEnvOrThrow(): void {
  const result = validateRequiredEnv();

  // Print warnings
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Environment Warnings:\n');
    result.warnings.forEach(warning => console.warn(warning));
    console.warn('');
  }

  // Throw on errors
  if (!result.isValid) {
    console.error('\n❌ Environment Validation Failed:\n');
    result.errors.forEach(error => console.error(error));
    console.error('\n💡 Please check your .env file and compare with .env.example\n');

    throw new Error(
      'Environment validation failed. Missing required environment variables.\n' +
      'See error messages above for details.'
    );
  }

  // Success message
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('✅ Environment validation passed\n');
  }
}

/**
 * Pretty print environment status for debugging
 */
export function printEnvStatus(): void {
  console.log('\n📋 Environment Configuration Status:\n');

  const checks = [
    { key: 'MONGODB_URI', present: !!process.env.MONGODB_URI, masked: true },
    { key: 'NEXTAUTH_URL', present: !!process.env.NEXTAUTH_URL, masked: false },
    { key: 'NEXTAUTH_SECRET', present: !!process.env.NEXTAUTH_SECRET, masked: true },
    { key: 'ADMIN_EMAIL', present: !!process.env.ADMIN_EMAIL, masked: false },
    { key: 'ADMIN_PASSWORD', present: !!process.env.ADMIN_PASSWORD, masked: true },
    { key: 'UPSTASH_REDIS_REST_URL', present: !!process.env.UPSTASH_REDIS_REST_URL, masked: true },
    { key: 'UPSTASH_REDIS_REST_TOKEN', present: !!process.env.UPSTASH_REDIS_REST_TOKEN, masked: true },
    { key: 'NEXT_PUBLIC_GEMINI_API_KEY', present: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY, masked: true },
  ];

  checks.forEach(({ key, present, masked }) => {
    const status = present ? '✅' : '❌';
    let value = '';

    if (present && !masked) {
      value = `: ${process.env[key]}`;
    } else if (present && masked) {
      value = ': ********';
    }

    console.log(`${status} ${key}${value}`);
  });

  console.log(`\n🌍 NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);
}
