#!/usr/bin/env node

/**
 * Environment Setup Script for Keycase CRM Demo
 * 
 * This script helps set up the .env file for first-time setup
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function generateSecret() {
  try {
    // Try to generate using openssl
    return execSync('openssl rand -base64 32', { encoding: 'utf8' }).trim();
  } catch (error) {
    // Fallback to Node.js crypto
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('base64');
  }
}

function setupEnvironment() {
  console.log('Setting up Keycase CRM Demo environment...\n');

  // Check if .env already exists
  if (existsSync('.env')) {
    console.log('.env file already exists!');
    console.log('Backup your current .env before proceeding.\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
      if (answer.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        process.exit(0);
      }
      createEnvFile();
      rl.close();
    });
  } else {
    createEnvFile();
  }
}

function createEnvFile() {
  try {
    // Read the example file
    const example = readFileSync('.env.example', 'utf8');
    
    // Generate a secure secret
    const secret = generateSecret();
    
    // Replace placeholders
    const envContent = example
      .replace('your-super-secret-nextauth-key-here-change-this-in-production', secret)
      .replace('# DATABASE_URL="file:./prisma/dev.db"', 'DATABASE_URL="file:./prisma/dev.db"')
      .replace('# BASE_URL="http://localhost:3000"', 'BASE_URL="http://localhost:3000"');

    // Write the .env file
    writeFileSync('.env', envContent);

    console.log('env file created successfully!');
    console.log('Generated secure NEXTAUTH_SECRET');
    console.log('Using SQLite database (development mode)\n');
    
    console.log('Next steps:');
    console.log('1. Review your .env file');
    console.log('2. Run: npx prisma migrate dev');
    console.log('3. Run: npm run dev\n');
    
  } catch (error) {
    console.error('Error setting up environment:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupEnvironment();