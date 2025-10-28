import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Role, User, Order, OrderStatus, VerificationRequest, SiteContent } from '../types';

const prisma = new PrismaClient();

export class DatabaseService {
  // Initialize database connection
  static async initialize() {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      
      // Seed initial data if database is empty
      await this.seedInitialData();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  // Seed initial data
  static async seedInitialData() {
    const userCount = await prisma.user.count();
    if (userCount > 0) return; // Already seeded

    console.log('🌱 Seeding initial data...');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('Password123', 10);

    // Create users
    const users = await Promise.all([
      // Customers
      prisma.user.create({
        data: {
          email: 'alice.johnson@gmail.com',
          fullName: 'Alice Johnson',
          phone: '+250788123456',
          role: Role.CUSTOMER,
          isVerified: true,
          totalOrders: 12,
          passwordHash: hashedPassword,
        }
      }),
      prisma.user.create({
        data: {
          email: 'david.mugisha@yahoo.com',
          fullName: 'David Mugisha',
          phone: '+250788234567',
          role: Role.CUSTOMER,
          isVerified: true,
          totalOrders: 8,
          passwordHash: hashedPassword,
        }
      }),
      prisma.user.create({
        data: {
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
      prisma.user.create({
        data: {
          email: 'marie.uwase@tumalink.com',
          fullName: 'Marie Uwase',
          phone: '+250788456789',
          role: Role.ORDER_PROCESSOR,
          isVerified: true,
          totalOrders: 0,
          passwordHash: hashedPassword,
        }
      }),
      prisma.user.create({
        data: {
          email: 'jean.habimana@tumalink.com',
          fullName: 'Jean Baptiste Habimana',
          phone: '+250788567890',
          role: Role.ORDER_PROCESSOR,
          isVerified: true,
          totalOrders: 0,
          passwordHash: hashedPassword,
        }
      }),
      prisma.user.create({
        data: {
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
      prisma.user.create({
        data: {
          email: 'grace.mukamana@tumalink.com',
          fullName: 'Grace Mukamana',
          phone: '+250788789012',
          role: Role.ADMIN,
          isVerified: true,
          totalOrders: 0,
          passwordHash: hashedPassword,
        }
      }),
      prisma.user.create({
        data: {
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
      prisma.user.create({
        data: {
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

    // Create sample orders for Alice Johnson
    const aliceUser = users[0];
    await Promise.all([
      prisma.order.create({
        data: {
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
      prisma.order.create({
        data: {
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

    // Create site content
    await prisma.siteContent.create({
      data: {
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

    console.log('✅ Initial data seeded successfully');
  }

  // User operations
  static async createUser(userData: {
    email: string;
    fullName: string;
    phone?: string;
    role?: Role;
    passwordHash: string;
  }) {
    return await prisma.user.create({
      data: {
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        role: userData.role || Role.CUSTOMER,
        passwordHash: userData.passwordHash,
      }
    });
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        orders: {
          include: {
            statusHistory: true
          }
        }
      }
    });
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateUserRole(userId: string, role: Role) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
  }

  // Order operations
  static async createOrder(orderData: {
    userId: string;
    productUrl: string;
    productName: string;
    quantity: number;
    variation?: string;
    specifications?: string;
    notes?: string;
    screenshotUrl?: string;
  }) {
    return await prisma.order.create({
      data: {
        ...orderData,
        status: OrderStatus.REQUESTED,
        statusHistory: {
          create: {
            status: OrderStatus.REQUESTED,
          }
        }
      },
      include: {
        statusHistory: true,
        user: true
      }
    });
  }

  static async getUserOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        statusHistory: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getAllOrders() {
    return await prisma.order.findMany({
      include: {
        user: true,
        statusHistory: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    return await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status }
      });

      // Add status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status,
        }
      });

      return updatedOrder;
    });
  }

  // Message operations
  static async createMessage(messageData: {
    orderId: string;
    senderId: string;
    receiverId: string;
    senderFullName: string;
    text?: string;
    imageUrl?: string;
    docUrl?: string;
    videoUrl?: string;
  }) {
    return await prisma.message.create({
      data: messageData
    });
  }

  static async getOrderMessages(orderId: string) {
    return await prisma.message.findMany({
      where: { orderId },
      orderBy: { timestamp: 'asc' }
    });
  }

  // Verification operations
  static async createVerificationRequest(requestData: {
    userId: string;
    fullName: string;
    phone: string;
    govIdUrl: string;
    selfieUrl: string;
  }) {
    return await prisma.verificationRequest.create({
      data: requestData
    });
  }

  static async getPendingVerificationRequests() {
    return await prisma.verificationRequest.findMany({
      where: { status: 'PENDING' },
      include: { user: true },
      orderBy: { submittedAt: 'desc' }
    });
  }

  static async approveVerificationRequest(requestId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      // Update verification request
      await tx.verificationRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' }
      });

      // Update user verification status
      await tx.user.update({
        where: { id: userId },
        data: { isVerified: true }
      });
    });
  }

  static async rejectVerificationRequest(requestId: string) {
    return await prisma.verificationRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' }
    });
  }

  // Site content operations
  static async getSiteContent() {
    return await prisma.siteContent.findFirst({
      include: {
        companies: true,
        heroMedia: true
      }
    });
  }

  static async updateSiteContent(section: string, data: any) {
    // Implementation depends on the specific section being updated
    return await prisma.siteContent.update({
      where: { id: 'site_content' },
      data: {
        // Map the section to appropriate fields
        ...(section === 'aboutUs' && {
          aboutUsText: data.text,
          aboutUsMediaUrl: data.mediaUrl,
          aboutUsMediaType: data.mediaType
        }),
        ...(section === 'terms' && { terms: data }),
        ...(section === 'privacy' && { privacy: data }),
        ...(section === 'socialLinks' && {
          socialFacebook: data.facebook,
          socialTwitter: data.twitter,
          socialInstagram: data.instagram
        }),
        ...(section === 'dashboardAnnouncement' && {
          announcementMessage: data.message,
          announcementActive: data.active
        })
      }
    });
  }

  // Utility methods
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Cleanup
  static async disconnect() {
    await prisma.$disconnect();
  }
}

export default DatabaseService;