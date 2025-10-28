# Site Management Enhancement for Super Administrators

## Overview
Enhance the existing site management system to allow Super Administrators to manage website content including advertisements and background media.

## Tasks

### 1. Database Schema Updates
- [ ] Add Advertisement model to schema.prisma
- [ ] Update SiteContent model to include advertisement relations
- [ ] Run database migration

### 2. Type Definitions
- [ ] Update types.ts to include Advertisement interface
- [ ] Update SiteContent interface to include advertisements array

### 3. API Backend Updates
- [ ] Add advertisement CRUD endpoints in server/api.js
- [ ] Update site-content endpoints to handle advertisements
- [ ] Add hero media management endpoints

### 4. Frontend Services
- [ ] Update services/api.ts with advertisement functions
- [ ] Add hero media management functions

### 5. UI Components
- [ ] Enhance SiteManagement component in DashboardPage.tsx
- [ ] Add Advertisement Management section
- [ ] Add Hero Media Management section
- [ ] Add Hero Display Mode controls

### 6. Homepage Updates
- [ ] Update HomePage.tsx to display advertisements
- [ ] Ensure hero media management works properly

### 7. Testing
- [ ] Test all new features as Super Administrator
- [ ] Verify advertisement display on homepage
- [ ] Verify hero media changes
