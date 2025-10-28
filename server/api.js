// Backend API Server for Tuma-Africa Link Cargo
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize database
async function initializeDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

// Start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'No account found with this email address.' 
      });
    }
    
    if (!user.passwordHash) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account not properly configured. Please contact support.' 
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password. Please try again.' 
      });
    }
    
    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      message: 'Login successful!', 
      user: {
        ...userWithoutPassword,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login. Please try again.' 
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists. Please log in instead.' 
      });
    }
    
    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        phone,
        role: 'Customer',
        passwordHash,
        isVerified: false,
        totalOrders: 0
      }
    });
    
    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      message: 'Account created successfully!', 
      user: {
        ...userWithoutPassword,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration. Please try again.' 
    });
  }
});

// Site Content Routes
app.get('/api/site-content', async (req, res) => {
  try {
    const content = await prisma.siteContent.findFirst({
      include: {
        companies: true,
        heroMedia: true,
        advertisements: true
      }
    });
    
    if (!content) {
      return res.json({
        aboutUs: { 
          text: "Tuma-Africa Link Cargo is your trusted partner for sourcing and shipping goods from China to Africa.", 
          mediaUrl: "https://picsum.photos/seed/about-us-cargo/600/400", 
          mediaType: 'image' 
        },
        terms: "Terms of service...",
        privacy: "Privacy policy...",
        socialLinks: { facebook: "#", twitter: "#", instagram: "#" },
        companies: [],
        heroMedia: [],
        heroDisplayMode: 'image'
      });
    }
    
    res.json({
      aboutUs: { 
        text: content.aboutUsText, 
        mediaUrl: content.aboutUsMediaUrl || '', 
        mediaType: content.aboutUsMediaType 
      },
      terms: content.terms,
      privacy: content.privacy,
      socialLinks: { 
        facebook: content.socialFacebook || '#', 
        twitter: content.socialTwitter || '#', 
        instagram: content.socialInstagram || '#' 
      },
      companies: content.companies.map(c => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logoUrl,
        websiteUrl: c.websiteUrl
      })),
      heroMedia: content.heroMedia.map(h => ({
        id: h.id,
        type: h.type,
        url: h.url,
        title: h.title || '',
        description: h.description || ''
      })),
      heroDisplayMode: content.heroDisplayMode,
      dashboardAnnouncement: {
        message: content.announcementMessage || '',
        active: content.announcementActive
      },
      advertisements: content.advertisements.map(a => ({
        id: a.id,
        title: a.title,
        imageUrl: a.imageUrl,
        linkUrl: a.linkUrl,
        isActive: a.isActive
      }))
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    res.status(500).json({ error: 'Failed to fetch site content' });
  }
});

// Orders Routes
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        statusHistory: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      userFullName: order.user.fullName
    })));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

app.post('/api/orders', upload.single('screenshot'), async (req, res) => {
  try {
    const { userId, productUrl, productName, quantity, variation, specifications, notes } = req.body;
    const screenshotUrl = req.file ? req.file.path : null;

    const order = await prisma.order.create({
      data: {
        userId,
        productUrl,
        productName,
        quantity: parseInt(quantity),
        variation,
        specifications,
        notes,
        screenshotUrl,
        status: 'REQUESTED',
        statusHistory: {
          create: {
            status: 'REQUESTED'
          }
        }
      },
      include: {
        statusHistory: true
      }
    });

    res.json({
      ...order,
      createdAt: order.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        statusHistory: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      userFullName: order.user.fullName
    })));
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status }
      });

      // Add status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status
        }
      });

      return order;
    });

    res.json({
      ...updatedOrder,
      updatedAt: updatedOrder.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { statusHistory: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      ...order,
      createdAt: order.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Messages Routes
app.get('/api/messages/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const messages = await prisma.message.findMany({
      where: { orderId },
      orderBy: { timestamp: 'asc' }
    });

    res.json(messages.map(message => ({
      ...message,
      timestamp: message.timestamp.toISOString()
    })));
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', upload.single('attachment'), async (req, res) => {
  try {
    const { orderId, senderId, receiverId, senderFullName, text } = req.body;

    let imageUrl = null;
    let docUrl = null;
    let videoUrl = null;

    if (req.file) {
      const fileType = req.file.mimetype;
      if (fileType.startsWith('image/')) {
        imageUrl = req.file.path;
      } else if (fileType.startsWith('video/')) {
        videoUrl = req.file.path;
      } else {
        docUrl = req.file.path;
      }
    }

    const message = await prisma.message.create({
      data: {
        orderId,
        senderId,
        receiverId,
        senderFullName,
        text,
        imageUrl,
        docUrl,
        videoUrl
      }
    });

    res.json({
      ...message,
      timestamp: message.timestamp.toISOString()
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Verification Routes
app.post('/api/verification', upload.fields([
  { name: 'govId', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId, fullName, phone } = req.body;
    const govIdUrl = req.files['govId'] ? req.files['govId'][0].path : null;
    const selfieUrl = req.files['selfie'] ? req.files['selfie'][0].path : null;

    const request = await prisma.verificationRequest.create({
      data: {
        userId,
        fullName,
        phone,
        govIdUrl,
        selfieUrl
      }
    });

    res.json({
      ...request,
      submittedAt: request.submittedAt.toISOString()
    });
  } catch (error) {
    console.error('Error creating verification request:', error);
    res.status(500).json({ error: 'Failed to create verification request' });
  }
});

app.get('/api/verification/pending', async (req, res) => {
  try {
    const requests = await prisma.verificationRequest.findMany({
      where: { status: 'PENDING' },
      include: { user: true },
      orderBy: { submittedAt: 'desc' }
    });

    res.json(requests.map(request => ({
      ...request,
      submittedAt: request.submittedAt.toISOString()
    })));
  } catch (error) {
    console.error('Error fetching pending verification requests:', error);
    res.status(500).json({ error: 'Failed to fetch verification requests' });
  }
});

app.put('/api/verification/:requestId/approve', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { userId, adminId } = req.body;

    await prisma.$transaction(async (tx) => {
      // Update verification request
      await tx.verificationRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: adminId
        }
      });

      // Update user verification status
      await tx.user.update({
        where: { id: userId },
        data: { isVerified: true }
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error approving verification request:', error);
    res.status(500).json({ error: 'Failed to approve verification request' });
  }
});

app.put('/api/verification/:requestId/reject', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminId } = req.body;

    await prisma.verificationRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: adminId
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error rejecting verification request:', error);
    res.status(500).json({ error: 'Failed to reject verification request' });
  }
});

// User Management Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString()
    })));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    res.json({
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Site Content Update Route
app.put('/api/site-content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const data = req.body;

    let updateData = {};

    switch (section) {
      case 'aboutUs':
        updateData = {
          aboutUsText: data.text,
          aboutUsMediaUrl: data.mediaUrl,
          aboutUsMediaType: data.mediaType
        };
        break;
      case 'terms':
        updateData = { terms: data };
        break;
      case 'privacy':
        updateData = { privacy: data };
        break;
      case 'socialLinks':
        updateData = {
          socialFacebook: data.facebook,
          socialTwitter: data.twitter,
          socialInstagram: data.instagram
        };
        break;
      case 'dashboardAnnouncement':
        updateData = {
          announcementMessage: data.message,
          announcementActive: data.active
        };
        break;
      case 'heroDisplayMode':
        updateData = { heroDisplayMode: data };
        break;
      default:
        return res.status(400).json({ error: 'Invalid section' });
    }

    const content = await prisma.siteContent.update({
      where: { id: 'site_content' },
      data: updateData
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating site content:', error);
    res.status(500).json({ error: 'Failed to update site content' });
  }
});

// Advertisement Routes
app.get('/api/advertisements', async (req, res) => {
  try {
    const advertisements = await prisma.advertisement.findMany({
      where: { siteContentId: 'site_content' },
      orderBy: { id: 'asc' }
    });

    res.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
});

app.post('/api/advertisements', upload.single('image'), async (req, res) => {
  try {
    const { title, linkUrl } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const advertisement = await prisma.advertisement.create({
      data: {
        title,
        imageUrl,
        linkUrl,
        siteContentId: 'site_content'
      }
    });

    res.json(advertisement);
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({ error: 'Failed to create advertisement' });
  }
});

app.put('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, linkUrl, isActive } = req.body;

    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: {
        title,
        linkUrl,
        isActive
      }
    });

    res.json(advertisement);
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({ error: 'Failed to update advertisement' });
  }
});

app.delete('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.advertisement.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ error: 'Failed to delete advertisement' });
  }
});

// Hero Media Routes
app.post('/api/hero-media', upload.single('media'), async (req, res) => {
  try {
    const { type } = req.body;
    const url = req.file ? req.file.path : null;

    if (!url) {
      return res.status(400).json({ error: 'Media file is required' });
    }

    const heroMedia = await prisma.heroMedia.create({
      data: {
        type,
        url,
        siteContentId: 'site_content'
      }
    });

    res.json(heroMedia);
  } catch (error) {
    console.error('Error creating hero media:', error);
    res.status(500).json({ error: 'Failed to create hero media' });
  }
});

app.delete('/api/hero-media/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.heroMedia.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting hero media:', error);
    res.status(500).json({ error: 'Failed to delete hero media' });
  }
});
