import { PrismaClient } from '@prisma/client';

// Import the seedData service - we'll need to build the project first
// or use a compiled version during deployment
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
  
  // Import and run the seed function
  try {
    // Dynamic import to handle the compiled TypeScript
    const { resetAndSeedDatabase } = await import('../src/services/seedData');
    
    console.log('Running comprehensive database seed...');
    await resetAndSeedDatabase();
    
    console.log('Deployment seed completed successfully!');
    console.log('All user accounts have password: Welcome1');
    
  } catch (error) {
    console.error('Deployment seed failed:', error);
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