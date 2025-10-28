import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Role, OrderStatus } from '../types';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('Password123', 10);

  // Create users
  const users = await Promise.all([
    // Customers
    prisma.user.upsert({
      where: { email: 'alice.johnson@gmail.com' },
      update: {},
      create: {
        email: 'alice.johnson@gmail.com',
        fullName: 'Alice Johnson',
        phone: '+250788123456',
        role: Role.CUSTOMER,
        isVerified: true,
        totalOrders: 12,
        passwordHash: hashedPassword,
      }
    }),
    prisma.user.upsert({
      where: { email: 'david.mugisha@yahoo.com' },
      update: {},
      create: {
        email: 'david.mugisha@yahoo.com',
        fullName: 'David Mugisha',
        phone: '+250788234567',
        role: Role.CUSTOMER,
        isVerified: true,
        totalOrders: 8,
        passwordHash: hashedPassword,
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah.uwimana@outlook.com' },
      update: {},
      create: {
        email: 'sarah.uwimana@outlook.com',
        fullName: 'Sarah Uwimana',
        phone: '+250788345678',
        role: Role.CUSTOMER,
        isVerified: false,
        totalOrders: 2,
        passwordHash: hashedPassword,
      }
    }),

    // Staff
    prisma.user.upsert({
      where: { email: 'marie.uwase@tumalink.com' },
      update: {},
      create: {
        email: 'marie.uwase@tumalink.com',
        fullName: 'Marie Uwase',
        phone: '+250788456789',
        role: Role.ORDER_PROCESSOR,
        isVerified: true,
        totalOrders: 0,
        passwordHash: hashedPassword,
      }
    }),
    prisma.user.upsert({
      where: { email: 'jean.habimana@tumalink.com' },
      update: {},
      create: {
        email: 'jean.habimana@tumalink.com',
        fullName: 'Jean Baptiste Habimana',
        phone: '+250788567890',
        role: Role.ORDER_PROCESSOR,
        isVerified: true,
        totalOrders: 0,
        passwordHash: hashedPassword,
      }
    }),
    prisma.user.upsert({
      where: { email: 'eric.nzeyimana@tumalink.com' },
      update: {},
      create: {
        email: 'eric.nzeyimana@tumalink.com',
        fullName: 'Eric Nzeyimana',
        phone: '+250788678901',
        role: Role.WAREHOUSE_MANAGER,
        isVerified: true,
        totalOrders: 0,
        passwordHash: hashedPassword,
      }
    }),

    // Management
    prisma.user.upsert({
      where: { email: 'grace.mukamana@tumalink.com' },
      update: {},
      create: {
        email: 'grace.mukamana@tumalink.com',
        fullName: 'Grace Mukamana',
        phone: '+250788789012',
        role: Role.ADMIN,
        isVerified: true,
        totalOrders: 0,
        passwordHash: hashedPassword,
      }
    }),
    prisma.user.upsert({
      where: { email: 'patrick.nkurunziza@tumalink.com' },
      update: {},
      create: {
        email: 'patrick.nkurunziza@tumalink.com',
        fullName: 'Patrick Nkurunziza',
        phone: '+250788890123',
        role: Role.SUPER_ADMIN,
        isVerified: true,
        totalOrders: 0,
        passwordHash: hashedPassword,
      }
    }),

    // Legacy test account
    prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        fullName: 'Test Customer',
        phone: '+250788000001',
        role: Role.CUSTOMER,
        isVerified: true,
        totalOrders: 4,
        passwordHash: hashedPassword,
      }
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample orders for Alice Johnson
  const aliceUser = users[0];
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { id: 'sample-order-1' },
      update: {},
      create: {
        id: 'sample-order-1',
        userId: aliceUser.id,
        productUrl: 'https://example.com/product/123',
        productName: 'Ergonomic Office Chair',
        quantity: 1,
        variation: 'Black',
        specifications: 'With headrest',
        notes: 'Please check quality before shipping.',
        screenshotUrl: 'https://picsum.photos/seed/chair/400/300',
        status: OrderStatus.IN_TRANSIT,
        statusHistory: {
          create: [
            { status: OrderStatus.REQUESTED, timestamp: new Date('2024-01-10') },
            { status: OrderStatus.PURCHASED, timestamp: new Date('2024-01-12') },
            { status: OrderStatus.IN_WAREHOUSE, timestamp: new Date('2024-01-18') },
            { status: OrderStatus.IN_TRANSIT, timestamp: new Date('2024-01-25') },
          ]
        }
      }
    }),
    prisma.order.upsert({
      where: { id: 'sample-order-2' },
      update: {},
      create: {
        id: 'sample-order-2',
        userId: aliceUser.id,
        productUrl: 'https://example.com/product/456',
        productName: 'Mechanical Keyboard',
        quantity: 2,
        variation: 'RGB, Blue Switches',
        screenshotUrl: 'https://picsum.photos/seed/keyboard/400/300',
        status: OrderStatus.COMPLETED,
        statusHistory: {
          create: [
            { status: OrderStatus.REQUESTED, timestamp: new Date('2023-12-05') },
            { status: OrderStatus.PURCHASED, timestamp: new Date('2023-12-06') },
            { status: OrderStatus.IN_WAREHOUSE, timestamp: new Date('2023-12-12') },
            { status: OrderStatus.IN_TRANSIT, timestamp: new Date('2023-12-20') },
            { status: OrderStatus.ARRIVED, timestamp: new Date('2023-12-27') },
            { status: OrderStatus.COMPLETED, timestamp: new Date('2023-12-28') },
          ]
        }
      }
    }),
  ]);

  console.log(`✅ Created ${orders.length} sample orders`);

  // Create site content
  await prisma.siteContent.upsert({
    where: { id: 'site_content' },
    update: {},
    create: {
      id: 'site_content',
      aboutUsText: "Tuma-Africa Link Cargo is your trusted partner for sourcing and shipping goods from China to Africa. We simplify the entire process, from finding your desired products on platforms like Alibaba and 1688.com to handling logistics and customs, delivering right to your doorstep.",
      aboutUsMediaUrl: "https://picsum.photos/seed/about-us-cargo/600/400",
      aboutUsMediaType: 'image',
      terms: "These are the terms of service for Tuma-Africa Link Cargo...",
      privacy: "This is the privacy policy for Tuma-Africa Link Cargo...",
      socialFacebook: "https://facebook.com/tumaafricacargo",
      socialTwitter: "https://twitter.com/tumaafricacargo",
      socialInstagram: "https://instagram.com/tumaafricacargo",
      announcementMessage: "Welcome to our new improved tracking system!",
      announcementActive: true,
      companies: {
        create: [
          { name: 'Alibaba', logoUrl: 'https://picsum.photos/seed/alibaba/120/60', websiteUrl: 'https://alibaba.com' },
          { name: '1688.com', logoUrl: 'https://picsum.photos/seed/1688/120/60', websiteUrl: 'https://1688.com' },
          { name: 'Taobao', logoUrl: 'https://picsum.photos/seed/taobao/120/60', websiteUrl: 'https://taobao.com' },
        ]
      }
    }
  });

  console.log('✅ Created site content');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });