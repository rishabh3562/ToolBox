// Environment Variable Checker
// Run this to verify your .env file is loaded correctly

const fs = require('fs');
const path = require('path');

// Manually load .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} else {
  console.error('❌ .env file not found at:', envPath);
  process.exit(1);
}

console.log('\n🔍 Environment Variable Check\n');

const checks = [
  { name: 'MONGODB_URI', required: true },
  { name: 'NEXTAUTH_URL', required: true },
  { name: 'NEXTAUTH_SECRET', required: true },
  { name: 'ADMIN_EMAIL', required: true },
  { name: 'ADMIN_PASSWORD', required: true },
  { name: 'ENABLE_RATE_LIMITING', required: false },
  { name: 'UPSTASH_REDIS_REST_URL', required: false },
];

let hasErrors = false;

checks.forEach(({ name, required }) => {
  const value = process.env[name];
  const status = value ? '✅' : (required ? '❌' : '⚠️ ');

  if (required && !value) {
    hasErrors = true;
  }

  // Show safe preview
  let preview = '';
  if (value) {
    if (name.includes('PASSWORD') || name.includes('SECRET') || name.includes('TOKEN')) {
      preview = ' = *****';
    } else if (name === 'MONGODB_URI' && value.includes('@')) {
      preview = ' = ' + value.replace(/\/\/([^:]+):([^@]+)@/, '//*****:*****@');
    } else {
      preview = ' = ' + value.substring(0, 50) + (value.length > 50 ? '...' : '');
    }
  }

  console.log(`${status} ${name}${preview}`);
});

console.log('\n');

if (hasErrors) {
  console.error('❌ ERRORS FOUND: Required environment variables are missing!');
  console.error('   Make sure you have a .env file in the project root.');
  console.error('   Copy .env.example to .env and fill in the values.\n');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!\n');
}

// Check MongoDB URI specifically
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  if (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
    console.warn('⚠️  WARNING: MONGODB_URI points to localhost');
    console.warn('   You are using a local MongoDB server.');
    console.warn('   For cloud database, use your MongoDB Atlas connection string.\n');
  } else if (mongoUri.includes('mongodb+srv')) {
    console.log('✅ MONGODB_URI is using MongoDB Atlas (cloud)\n');
  }
}
