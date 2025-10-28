# User Roles & Account System

## 🎭 **Updated Role System**

### **Role Hierarchy:**
1. **👤 Customer** - Places orders and tracks shipments
2. **📋 Order Processor** - Processes and manages customer orders  
3. **📦 Warehouse Manager** - Manages warehouse operations and inventory
4. **⚙️ Administrator** - System administration and user management
5. **👑 Super Administrator** - Full system access and control

## 👥 **Test Accounts with Real Names**

### **🛍️ Customers:**
- **Alice Johnson** (`alice.johnson@gmail.com`)
  - Role: Customer
  - Status: Verified, 12 orders
  - Phone: +250788123456

- **David Mugisha** (`david.mugisha@yahoo.com`)
  - Role: Customer  
  - Status: Verified, 8 orders
  - Phone: +250788234567

- **Sarah Uwimana** (`sarah.uwimana@outlook.com`)
  - Role: Customer
  - Status: Unverified, 2 orders
  - Phone: +250788345678

### **👷 Staff Members:**
- **Marie Uwase** (`marie.uwase@tumalink.com`)
  - Role: Order Processor
  - Department: Order Management
  - Phone: +250788456789

- **Jean Baptiste Habimana** (`jean.habimana@tumalink.com`)
  - Role: Order Processor
  - Department: Order Management (Senior)
  - Phone: +250788567890

- **Eric Nzeyimana** (`eric.nzeyimana@tumalink.com`)
  - Role: Warehouse Manager
  - Department: Warehouse Operations
  - Phone: +250788678901

### **👔 Management:**
- **Grace Mukamana** (`grace.mukamana@tumalink.com`)
  - Role: Administrator
  - Department: System Administration
  - Phone: +250788789012

- **Patrick Nkurunziza** (`patrick.nkurunziza@tumalink.com`)
  - Role: Super Administrator
  - Department: Executive Management
  - Phone: +250788890123

### **🔧 Legacy Account:**
- **Test Customer** (`user@test.com`)
  - Role: Customer
  - Status: Legacy test account
  - Phone: +250788000001

## 🔐 **Authentication Details**

### **Universal Password:**
All test accounts use: `Password123`

### **Account Features by Role:**

#### **👤 Customer Permissions:**
- View own orders and tracking
- Place new orders
- Update profile information
- Contact support

#### **📋 Order Processor Permissions:**
- View all customer orders
- Update order status
- Process order requests
- Communicate with customers

#### **📦 Warehouse Manager Permissions:**
- Manage inventory
- Update shipment status
- Oversee warehouse operations
- Generate warehouse reports

#### **⚙️ Administrator Permissions:**
- User management
- System configuration
- View all orders and users
- Generate system reports

#### **👑 Super Administrator Permissions:**
- Full system access
- Manage all users and roles
- System-wide configuration
- Complete administrative control

## 🎨 **Visual Design**

### **Role Color Coding:**
- **Customer**: Blue (`text-blue-400`)
- **Order Processor**: Green (`text-green-400`)
- **Warehouse Manager**: Orange (`text-orange-400`)
- **Administrator**: Purple (`text-purple-400`)
- **Super Administrator**: Red (`text-red-400`)

### **Role Icons:**
- **👤** Customer
- **📋** Order Processor
- **📦** Warehouse Manager
- **⚙️** Administrator
- **👑** Super Administrator

## 🧪 **Testing Different Roles**

### **Quick Test Flow:**
1. **Login** with any account (password: Password123)
2. **Observe** different dashboard features based on role
3. **Test** role-specific permissions and UI elements
4. **Switch** between accounts to see different perspectives

### **Realistic Scenarios:**
- **Customer Journey**: Login as Alice Johnson to see customer experience
- **Staff Workflow**: Login as Marie Uwase to process orders
- **Management View**: Login as Grace Mukamana for admin features
- **Executive Access**: Login as Patrick Nkurunziza for full control

## 🔄 **Account Management**

### **New User Registration:**
- New users automatically get "Customer" role
- Google OAuth users also get "Customer" role by default
- Role upgrades require administrator approval

### **Role-Based Features:**
Each role sees different:
- Dashboard layouts
- Available menu options
- Data access levels
- Action permissions

## 📱 **User Interface**

### **Role Display Components:**
- `UserRoleDisplay` - Shows user name, role, and icon
- `TestAccountsDisplay` - Interactive list of all test accounts
- Role-based styling and permissions throughout the app

### **Account Selection:**
- Expandable test account list
- Grouped by role type (Customers, Staff, Management)
- Quick access to account details and descriptions