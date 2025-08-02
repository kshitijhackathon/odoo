# 🏛️ CivicSense - Civic Issue Tracking Platform

A modern, full-stack web application for citizens to report and track civic issues in their communities. Built with React, TypeScript, and Express.js.

![CivicSense Banner](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/Main%20Page.png)

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure authentication system with form validation
- **Profile Management**: User profile customization and settings
- **Session Management**: Persistent login sessions with secure token handling

### 📊 Dashboard & Analytics
- **Interactive Dashboard**: Real-time overview of civic issues and statistics
- **Issue Tracking**: Comprehensive tracking of reported issues with status updates
- **Analytics**: Visual charts and graphs showing issue trends and patterns

### 🗺️ Interactive Map
- **Geolocation Support**: Report issues with precise location mapping
- **Interactive Map Interface**: Visual representation of all reported issues
- **Location-based Filtering**: Filter issues by area and proximity

### 📝 Issue Management
- **Issue Reporting**: Easy-to-use form for reporting new civic issues
- **Photo Attachments**: Support for image uploads to provide visual evidence
- **Status Updates**: Real-time status tracking from "Reported" to "Resolved"
- **Comments & Discussions**: Community engagement through comments on issues

### 🔔 Notifications
- **Real-time Notifications**: Instant updates on issue status changes
- **Email Notifications**: Automated email alerts for important updates
- **Notification Center**: Centralized notification management

### 👨‍💼 Admin Panel
- **Admin Dashboard**: Comprehensive administrative interface
- **Issue Management**: Bulk operations and status management
- **User Management**: Admin controls for user accounts
- **Analytics & Reports**: Detailed insights and reporting tools

### 🌙 Dark Mode
- **Theme Toggle**: Switch between light and dark themes
- **Persistent Preferences**: Theme preference saved across sessions
- **Responsive Design**: Optimized for all screen sizes

## 📸 Screenshots

### 🏠 Main Landing Page
![Main Page](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/Main%20Page.png)

### 🔐 Authentication
![Sign In](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/Signin.png)

![Sign Up](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/signup.png)

### 📊 Dashboard
![Dashboard](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/Dashboard.png)

### 🗺️ Issue Management
![All Complaints](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/All%20Complaints.png)

![Add Reports](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/Add%20Reports.png)

![My Reports](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/My%20Reports.png)

### 📋 Issue Details
![See Full Report](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/See%20FUll%20Report.png)

### 👨‍💼 Admin Interface
![Admin Panel](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/Admin.png)

### 🔔 Notifications
![Notification Bar](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/Notification%20Bar.png)

### 🌙 Theme Support
![Dark Mode](https://raw.githubusercontent.com/kshitijhackathon/odoo/main/assets/DarkMode.png)

## 🛠️ Tech Stack

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Radix UI**
- **Framer Motion**
- **React Query**
- **React Hook Form**
- **Wouter**

### Backend
- **Express.js**
- **Node.js**
- **TypeScript**
- **Drizzle ORM**
- **PostgreSQL**
- **Passport.js**
- **WebSocket**

### Development Tools
- **ESBuild**
- **Drizzle Kit**
- **PostCSS**
- **Autoprefixer**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL

### Installation

```bash
git clone https://github.com/kshitijhackathon/odoo.git
cd odoo
npm install
cp .env.example .env
# Configure .env file
npm run db:push
npm run dev

Frontend/
├── assets/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── issues/
│   │   │   ├── layout/
│   │   │   ├── map/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/
│   └── schema.ts
└── package.json

🔌 API Endpoints
Authentication
POST /auth/login

POST /auth/signup

POST /auth/logout

Issues
GET /api/issues

POST /api/issues

GET /api/issues/:id

PUT /api/issues/:id

DELETE /api/issues/:id

User Management
GET /api/users/profile

PUT /api/users/profile

GET /api/users/reports

Admin
GET /api/admin/dashboard

PUT /api/admin/issues/:id

GET /api/admin/analytics

🤝 Contributing
We welcome contributions to CivicSense!

Fork the repo

Create a new branch

Make changes

Push and open a PR

📄 License
This project is licensed under the MIT License.

🙏 Acknowledgments
React

Vite

Tailwind CSS

Radix UI

Drizzle ORM

📞 Support
Open an issue

Contact the team

Check docs

---

### ✅ Next Steps for You

- Copy this Markdown content into your `README.md`.
- Commit & push it to GitHub.
- Preview will be visible directly on your repo page.

Need a downloadable file or want the images compressed? Just say the word.
