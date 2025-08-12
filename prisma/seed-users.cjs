const { PrismaClient } = require('@prisma/client');
const { hash, genSalt } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding users and roles...');

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

  console.log('Roles created:', { adminRole, userRole, managerRole, viewerRole });

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
      username: 'john.doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@demo.com',
      department: 'Sales',
      roleId: userRole.id,
      active: true,
      passwordHash,
      salt
    },
    {
      username: 'jane.manager',
      firstName: 'Jane',
      lastName: 'Manager',
      email: 'jane.manager@demo.com',
      department: 'Sales',
      roleId: managerRole.id,
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
    },
    {
      username: 'archived.user',
      firstName: 'Archived',
      lastName: 'User',
      email: 'archived.user@demo.com',
      department: 'HR',
      roleId: viewerRole.id,
      active: false,
      archived: true,
      archivedAt: new Date('2024-01-01'),
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

  console.log('✅ Database has been seeded with demo users!');
  console.log('');
  console.log('Demo login credentials:');
  console.log('Username: admin, Password: Welcome1 (Admin role)');
  console.log('Username: john.doe, Password: Welcome1 (User role)');
  console.log('Username: jane.manager, Password: Welcome1 (Manager role)');
  console.log('Username: test.user, Password: Welcome1 (User role)');
  console.log('');
  console.log('Note: archived.user is created as an archived/inactive user for testing purposes');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });