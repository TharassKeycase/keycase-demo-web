const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./prod.db',
    },
  },
});

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
    console.log('Running basic database seed with users and roles...');
    
    // Import the seed logic directly
    const { hash, genSalt } = require('bcryptjs');

    // First ensure roles exist
    const adminRole = await prisma.role.upsert({
      where: { name: 'Admin' },
      update: {},
      create: { id: 1, name: 'Admin' }
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'User' },
      update: {},
      create: { id: 2, name: 'User' }
    });

    const managerRole = await prisma.role.upsert({
      where: { name: 'Manager' },
      update: {},
      create: { id: 3, name: 'Manager' }
    });

    const viewerRole = await prisma.role.upsert({
      where: { name: 'Viewer' },
      update: {},
      create: { id: 4, name: 'Viewer' }
    });

    console.log('Roles created/updated');

    // Create default password hash for "Welcome1"
    const salt = await genSalt(12);
    const passwordHash = await hash('Welcome1', salt);

    // Create demo users
    const demoUsers = [
      {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@demo.com',
        department: 'IT',
        roleId: adminRole.id,
        active: true,
        passwordHash,
        salt
      },
      {
        username: 'john.manager',
        firstName: 'John',
        lastName: 'Manager',
        email: 'john.manager@demo.com',
        department: 'Sales',
        roleId: managerRole.id,
        active: true,
        passwordHash,
        salt
      },
      {
        username: 'jane.user',
        firstName: 'Jane',
        lastName: 'User',
        email: 'jane.user@demo.com',
        department: 'Sales',
        roleId: userRole.id,
        active: true,
        passwordHash,
        salt
      },
      {
        username: 'bob.viewer',
        firstName: 'Bob',
        lastName: 'Viewer',
        email: 'bob.viewer@demo.com',
        department: 'Support',
        roleId: viewerRole.id,
        active: true,
        passwordHash,
        salt
      },
      {
        username: 'test.user',
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@demo.com',
        department: 'QA',
        roleId: userRole.id,
        active: true,
        passwordHash,
        salt
      }
    ];

    for (const userData of demoUsers) {
      const user = await prisma.user.upsert({
        where: { 
          username_archived: {
            username: userData.username,
            archived: userData.archived || false
          }
        },
        update: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          department: userData.department,
          roleId: userData.roleId,
          active: userData.active,
          archived: userData.archived || false,
          archivedAt: userData.archivedAt || null,
          passwordHash: userData.passwordHash,
          salt: userData.salt
        },
        create: userData
      });

      console.log(`Created/updated user: ${user.username} (${user.firstName} ${user.lastName})`);
    }
    
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