import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const resetAndSeedDatabase = async (): Promise<void> => {
  console.log('🔄 Starting database reset and seeding...');

  try {
    // Clear all data in proper order (respecting foreign key constraints)
    console.log('🗑️ Clearing existing data...');
    
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});

    console.log('✅ All existing data cleared');

    // Create roles
    console.log('👥 Creating roles...');
    const adminRole = await prisma.role.create({
      data: { id: 1, name: 'Admin' }
    });
    const userRole = await prisma.role.create({
      data: { id: 2, name: 'User' }
    });
    const managerRole = await prisma.role.create({
      data: { id: 3, name: 'Manager' }
    });
    const viewerRole = await prisma.role.create({
      data: { id: 4, name: 'Viewer' }
    });

    console.log('✅ Roles created');

    // Create password hash for "Welcome1"
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('Welcome1', salt);

    // Create users (one for each role + extra users)
    console.log('👤 Creating users...');
    const userData = [
        {
          id: 1,
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
          id: 2,
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
          id: 3,
          username: 'jane.user',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.user@demo.com',
          department: 'Sales',
          roleId: userRole.id,
          active: true,
          passwordHash,
          salt
        },
        {
          id: 4,
          username: 'bob.viewer',
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob.viewer@demo.com',
          department: 'Support',
          roleId: viewerRole.id,
          active: true,
          passwordHash,
          salt
        },
        {
          id: 5,
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
          id: 6,
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

    for (const user of userData) {
      await prisma.user.create({ data: user });
    }

    console.log('✅ Users created');

    // Create customers (5)
    console.log('🏢 Creating customers...');
    const customerData = [
        {
          id: 1,
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          address: '123 Business Ave',
          city: 'New York',
          country: 'USA',
          phone: '+1-555-0101',
          createdById: 1
        },
        {
          id: 2,
          name: 'Tech Solutions Inc',
          email: 'info@techsolutions.com',
          address: '456 Innovation Drive',
          city: 'San Francisco',
          country: 'USA',
          phone: '+1-555-0202',
          createdById: 2
        },
        {
          id: 3,
          name: 'Global Enterprises Ltd',
          email: 'sales@globalent.com',
          address: '789 Commerce Street',
          city: 'Chicago',
          country: 'USA',
          phone: '+1-555-0303',
          createdById: 1
        },
        {
          id: 4,
          name: 'Digital Dynamics',
          email: 'hello@digitaldynamics.com',
          address: '321 Tech Plaza',
          city: 'Austin',
          country: 'USA',
          phone: '+1-555-0404',
          createdById: 2
        },
        {
          id: 5,
          name: 'Innovation Partners',
          email: 'contact@innovpartners.com',
          address: '654 Startup Lane',
          city: 'Seattle',
          country: 'USA',
          phone: '+1-555-0505',
          createdById: 1
        }
      ];

    for (const customer of customerData) {
      await prisma.customer.create({ data: customer });
    }

    console.log('✅ Customers created');

    // Create products (20)
    console.log('📦 Creating products...');
    const productData = [
      { name: 'Premium Software License', description: 'Enterprise-grade software licensing solution', price: 299.99 },
      { name: 'Cloud Storage Plan', description: '1TB cloud storage with advanced security', price: 49.99 },
      { name: 'Project Management Tool', description: 'Complete project management suite', price: 199.99 },
      { name: 'Analytics Dashboard', description: 'Real-time business analytics platform', price: 399.99 },
      { name: 'Security Suite', description: 'Comprehensive cybersecurity package', price: 599.99 },
      { name: 'Communication Platform', description: 'Unified business communication solution', price: 99.99 },
      { name: 'CRM System', description: 'Customer relationship management system', price: 249.99 },
      { name: 'E-commerce Platform', description: 'Complete online store solution', price: 449.99 },
      { name: 'Mobile App Builder', description: 'No-code mobile application builder', price: 179.99 },
      { name: 'Database Management', description: 'Enterprise database management tools', price: 349.99 },
      { name: 'API Gateway', description: 'Scalable API management solution', price: 199.99 },
      { name: 'Monitoring Tools', description: 'System performance monitoring suite', price: 149.99 },
      { name: 'Backup Solution', description: 'Automated backup and recovery system', price: 89.99 },
      { name: 'Load Balancer', description: 'High-availability load balancing service', price: 299.99 },
      { name: 'Content Delivery Network', description: 'Global content delivery platform', price: 79.99 },
      { name: 'Machine Learning Platform', description: 'AI/ML development and deployment tools', price: 699.99 },
      { name: 'DevOps Pipeline', description: 'Continuous integration/deployment solution', price: 399.99 },
      { name: 'Video Conferencing', description: 'HD video conferencing platform', price: 29.99 },
      { name: 'Document Management', description: 'Digital document workflow system', price: 129.99 },
      { name: 'Training Platform', description: 'Online learning management system', price: 199.99 }
    ];

    for (let i = 0; i < productData.length; i++) {
      const product = productData[i];
      await prisma.product.create({
        data: {
          id: i + 1,
          ...product,
          createdById: (i % 2) + 1 // Alternate between user 1 and 2
        }
      });
    }

    console.log('✅ Products created');

    // Create orders (10) with order items
    console.log('🛒 Creating orders...');
    const orderData = [
      { customerId: 1, total: 849.97, state: 'COMPLETED', items: [{ productId: 1, quantity: 2, price: 299.99 }, { productId: 2, quantity: 5, price: 49.99 }] },
      { customerId: 2, total: 599.99, state: 'COMPLETED', items: [{ productId: 5, quantity: 1, price: 599.99 }] },
      { customerId: 3, total: 449.98, state: 'PENDING', items: [{ productId: 3, quantity: 1, price: 199.99 }, { productId: 8, quantity: 1, price: 249.99 }] },
      { customerId: 1, total: 1099.97, state: 'COMPLETED', items: [{ productId: 4, quantity: 1, price: 399.99 }, { productId: 16, quantity: 1, price: 699.99 }] },
      { customerId: 4, total: 279.98, state: 'DRAFT', items: [{ productId: 9, quantity: 1, price: 179.99 }, { productId: 6, quantity: 1, price: 99.99 }] },
      { customerId: 5, total: 799.96, state: 'COMPLETED', items: [{ productId: 7, quantity: 2, price: 249.99 }, { productId: 10, quantity: 1, price: 299.99 }] },
      { customerId: 2, total: 179.98, state: 'PENDING', items: [{ productId: 11, quantity: 1, price: 89.99 }, { productId: 12, quantity: 1, price: 89.99 }] },
      { customerId: 3, total: 729.97, state: 'COMPLETED', items: [{ productId: 13, quantity: 1, price: 349.99 }, { productId: 17, quantity: 1, price: 379.99 }] },
      { customerId: 4, total: 159.98, state: 'DRAFT', items: [{ productId: 18, quantity: 2, price: 79.99 }] },
      { customerId: 5, total: 329.98, state: 'PENDING', items: [{ productId: 19, quantity: 1, price: 129.99 }, { productId: 20, quantity: 1, price: 199.99 }] }
    ];

    for (let i = 0; i < orderData.length; i++) {
      const orderInfo = orderData[i];
      const order = await prisma.order.create({
        data: {
          id: i + 1,
          customerId: orderInfo.customerId,
          total: orderInfo.total,
          state: orderInfo.state,
          createdById: ((i % 2) + 1) // Alternate between user 1 and 2
        }
      });

      // Create order items
      for (const item of orderInfo.items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            createdById: ((i % 2) + 1)
          }
        });
      }
    }

    console.log('✅ Orders and order items created');

    console.log('🎉 Database reset and seeding completed successfully!');
    console.log('');
    console.log('📊 Data Summary:');
    console.log('- 4 Roles (Admin, Manager, User, Viewer)');
    console.log('- 6 Users (including 1 archived)');
    console.log('- 5 Customers');
    console.log('- 20 Products');
    console.log('- 10 Orders with multiple order items');
    console.log('');
    console.log('🔐 All users have password: Welcome1');
    console.log('👤 Test accounts:');
    console.log('  - admin (Admin role)');
    console.log('  - john.manager (Manager role)');
    console.log('  - jane.user (User role)');
    console.log('  - bob.viewer (Viewer role)');
    console.log('  - test.user (User role)');
    console.log('  - archived.user (Viewer role, archived)');

  } catch (error) {
    console.error('❌ Error during database reset and seeding:', error);
    throw error;
  }
};