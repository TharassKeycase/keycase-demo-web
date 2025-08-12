const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting deployment seed process...');
  
  // Environment safety checks
  const nodeEnv = process.env.NODE_ENV || 'development';
  const demoMode = process.env.DEMO_MODE === 'true';
  const forceSeed = process.env.FORCE_SEED === 'true';
  
  console.log('Environment:', nodeEnv);
  console.log('Demo Mode:', demoMode);
  console.log('Force Seed:', forceSeed);
  
  // Safety check: Don't seed production unless explicitly enabled
  if (nodeEnv === 'production' && !demoMode && !forceSeed) {
    console.log('Skipping seed in production environment');
    console.log('To enable seeding in production, set DEMO_MODE=true or FORCE_SEED=true');
    return;
  }
  
  try {
    // Try to import the compiled seed function
    let seedFunction;
    
    try {
      // First try to import from the built/compiled version
      const seedModule = require('../.next/server/src/services/seedData.js');
      seedFunction = seedModule.resetAndSeedDatabase;
    } catch (buildError) {
      try {
        // If that fails, try to import from dist folder (if using tsc)
        const seedModule = require('../dist/src/services/seedData.js');
        seedFunction = seedModule.resetAndSeedDatabase;
      } catch (distError) {
        // If neither works, try direct TypeScript execution
        console.log('Could not find compiled seed function, trying to compile on-the-fly...');
        
        // This requires ts-node to be installed
        require('ts-node/register');
        const seedModule = require('../src/services/seedData.ts');
        seedFunction = seedModule.resetAndSeedDatabase;
      }
    }
    
    if (!seedFunction) {
      throw new Error('Could not load seed function. Make sure the project is built or ts-node is available.');
    }
    
    console.log('Running comprehensive database seed...');
    await seedFunction();
    
    console.log('Deployment seed completed successfully!');
    console.log('All user accounts have password: Welcome1');
    console.log('');
    console.log('Test Accounts Available:');
    console.log('  - admin (Admin role)');
    console.log('  - john.manager (Manager role)');
    console.log('  - jane.user (User role)');
    console.log('  - bob.viewer (Viewer role)');
    console.log('  - test.user (User role)');
    console.log('');
    
  } catch (error) {
    console.error('❌ Deployment seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Fatal error during deployment seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });