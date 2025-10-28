import { Role, User, Order, OrderStatus, VerificationRequest, SiteContent, Message, Company, HeroMedia, Advertisement } from '../types';

// Backend API base URL
const API_BASE_URL = 'http://localhost:3002/api';

export const getSiteContent = async (): Promise<SiteContent> => {
    try {
        const response = await fetch(`${API_BASE_URL}/site-content`);
        if (!response.ok) {
            throw new Error('Failed to fetch site content');
        }
        const content = await response.json();

        return {
            aboutUs: {
                text: content.aboutUs.text,
                mediaUrl: content.aboutUs.mediaUrl,
                mediaType: content.aboutUs.mediaType
            },
            terms: content.terms,
            privacy: content.privacy,
            socialLinks: content.socialLinks,
            companies: content.companies,
            heroMedia: content.heroMedia,
            heroDisplayMode: content.heroDisplayMode,
            dashboardAnnouncement: content.dashboardAnnouncement || { message: '', active: false },
            advertisements: content.advertisements || []
        };
    } catch (error) {
        console.error('Error fetching site content:', error);
        // Return default content on error
        return {
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
            heroDisplayMode: 'image',
            dashboardAnnouncement: { message: '', active: false },
            advertisements: []
        };
    }
};

export const updateSiteContent = async (section: keyof SiteContent, data: any): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/site-content/${section}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update site content');
        }
    } catch (error) {
        console.error('Error updating site content:', error);
        throw error;
    }
};

export const submitVerificationRequest = async (data: FormData, user: User): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('fullName', data.get('fullName') as string);
        formData.append('phone', data.get('phone') as string);
        formData.append('govId', data.get('govId') as File);
        formData.append('selfie', data.get('selfie') as File);

        const response = await fetch(`${API_BASE_URL}/verification`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to submit verification request');
        }
    } catch (error) {
        console.error('Error submitting verification request:', error);
        throw error;
    }
};

export const getPendingVerificationRequests = async (): Promise<VerificationRequest[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/verification/pending`);
        if (!response.ok) {
            throw new Error('Failed to fetch verification requests');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching verification requests:', error);
        throw error;
    }
};

export const approveVerificationRequest = async (requestId: string, userId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/verification/${requestId}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error('Failed to approve verification request');
        }
    } catch (error) {
        console.error('Error approving verification request:', error);
        throw error;
    }
};

export const rejectVerificationRequest = async (requestId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/verification/${requestId}/reject`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error('Failed to reject verification request');
        }
    } catch (error) {
        console.error('Error rejecting verification request:', error);
        throw error;
    }
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const updateUserRole = async (userId: string, newRole: Role): Promise<User> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: newRole }),
        });

        if (!response.ok) {
            throw new Error('Failed to update user role');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};

export const createOrderRequest = async (data: FormData, user: User): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('productUrl', data.get('productUrl') as string);
        formData.append('productName', data.get('productName') as string);
        formData.append('quantity', data.get('quantity') as string);
        formData.append('variation', data.get('variation') as string || '');
        formData.append('specifications', data.get('specifications') as string || '');
        formData.append('notes', data.get('notes') as string || '');
        formData.append('screenshotUrl', URL.createObjectURL(data.get('screenshot') as File));

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const getOrderById = async (orderId: string): Promise<{ order: Order, messages: Message[] }> => {
  try {
    const [orderResponse, messagesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/orders/${orderId}`),
      fetch(`${API_BASE_URL}/messages/order/${orderId}`)
    ]);

    if (!orderResponse.ok) {
      throw new Error('Failed to fetch order');
    }

    if (!messagesResponse.ok) {
      throw new Error('Failed to fetch messages');
    }

    const order = await orderResponse.json();
    const messages = await messagesResponse.json();

    return { order, messages };
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user orders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch all orders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export const getMessagesByOrderId = async (orderId: string): Promise<Message[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/order/${orderId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const sendMessage = async (orderId: string, sender: User, text: string, attachment?: File | null): Promise<Message> => {
    try {
        // First get the order to determine receiver
        const orderResponse = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        if (!orderResponse.ok) {
            throw new Error('Failed to fetch order');
        }
        const order = await orderResponse.json();

        let receiverId: string;

        // Dynamic receiver logic based on sender role
        if (sender.role === Role.CUSTOMER) {
            // Customer sends to first available ORDER_PROCESSOR
            const usersResponse = await fetch(`${API_BASE_URL}/users`);
            if (!usersResponse.ok) {
                throw new Error('Failed to fetch users');
            }
            const users = await usersResponse.json();
            const orderProcessor = users.find((u: User) => u.role === Role.ORDER_PROCESSOR);
            if (!orderProcessor) {
                throw new Error('No order processor available');
            }
            receiverId = orderProcessor.id;
        } else {
            // Staff sends to the customer of the order
            receiverId = order.userId;
        }

        const formData = new FormData();
        formData.append('orderId', orderId);
        formData.append('senderId', sender.id);
        formData.append('receiverId', receiverId);
        formData.append('senderFullName', sender.fullName);
        if (text.trim()) {
            formData.append('text', text.trim());
        }
        if (attachment) {
            if (attachment.type.startsWith('image/')) {
                formData.append('imageUrl', attachment);
            } else if (attachment.type.startsWith('video/')) {
                formData.append('videoUrl', attachment);
            } else {
                formData.append('docUrl', attachment);
            }
        }

        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Advertisement API functions
export const getAdvertisements = async (): Promise<Advertisement[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/advertisements`);
        if (!response.ok) {
            throw new Error('Failed to fetch advertisements');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        throw error;
    }
};

export const createAdvertisement = async (data: FormData): Promise<Advertisement> => {
    try {
        const response = await fetch(`${API_BASE_URL}/advertisements`, {
            method: 'POST',
            body: data,
        });

        if (!response.ok) {
            throw new Error('Failed to create advertisement');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating advertisement:', error);
        throw error;
    }
};

export const updateAdvertisement = async (id: string, data: Partial<Advertisement>): Promise<Advertisement> => {
    try {
        const response = await fetch(`${API_BASE_URL}/advertisements/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update advertisement');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating advertisement:', error);
        throw error;
    }
};

export const deleteAdvertisement = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/advertisements/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete advertisement');
        }
    } catch (error) {
        console.error('Error deleting advertisement:', error);
        throw error;
    }
};

// Hero Media API functions
export const createHeroMedia = async (data: FormData): Promise<HeroMedia> => {
    try {
        const response = await fetch(`${API_BASE_URL}/hero-media`, {
            method: 'POST',
            body: data,
        });

        if (!response.ok) {
            throw new Error('Failed to create hero media');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating hero media:', error);
        throw error;
    }
};

export const deleteHeroMedia = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/hero-media/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete hero media');
        }
    } catch (error) {
        console.error('Error deleting hero media:', error);
        throw error;
    }
};
