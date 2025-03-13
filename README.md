# Polymap Mono Repo
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13.x-lightblue)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-pink)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

Polymap is a comprehensive geospatial management platform comprising two main projects:
- **Polymap API**: A RESTful service for managing geospatial data.
- **Polymap Web**: A modern, interactive web interface for geospatial management.

This monorepo organizes the two projects into separate folders for easy management and scalability.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a96044e3-3f8d-4d02-9856-75c292489c5b" width="400">
</p>

### For more details, please refer to each project's documentation. ❗
---

## 🌟 Features
- Geospatial API: Manage users and regions with complex spatial queries
- Modern Web Interface: Interactive map visualization and management
- Secure Authentication: JWT-based authentication flow
- Advanced Architecture: Clean Architecture + Atomic Design patterns
- Full Type Safety: TypeScript end-to-end

## 📦 Tech Stack
### Frontend
- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Language**: TypeScript
- **Testing**: Jest + Supertest
- **Styling**: Tailwind CSS 4
- **Architecture**: Atomic Design
### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose ODM)
- **Language**: TypeScript
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Cache**: Redis
- **Architecture**: Clean Architecture

## 🚀 Quick Start

### Clone the repository:
```bash
git clone https://github.com/caetanojpo/polymaps.git
```
### Backend
### Access folder:
```bash
cd polymaps/api
```

### Install dependencies:
```bash
npm install
```

### Docker:
If you wish, you can use the docker-compose file that is already set in the project:
```bash
docker-compose up -d
```
❗ You will need to configure the DB connection string in the `.env` file.

### Run the application:
```bash
npm run dev
```

### Frontend
### Access folder:
```bash
cd polymaps/front (considering that you on the root folder)
```

### Install dependencies:
```bash
npm install
```

### Run the application:
```bash
npm run dev
```

## 🔧 Configuration

### Frontend Environment (.env.local)
Create a `.env` file using the `.env.local` template. Replace placeholders with actual values:
```bash
NEXT_PUBLIC_DEV_URL=http://localhost:8000
```

### API Environment (.env)
Create a `.env` file using the `.env.example` template. Replace placeholders with actual values:
```bash
# Server settings
PORT=8000
NODE_ENV=dev
LOG_LEVEL=info

# Database settings
DB_URI=mongodb://admin:admin@localhost:27017/oz_test?authSource=admin
DB_USER=admin
DB_PASS=oz_test

#Cache
REDIS_URI=redis://localhost:6379

# CORS allowed origins
ALLOWED_ORIGINS=*

#AUTH
JWT_SECRET="oz_test123"
```

## 🎉 Thank you for your interest!
I really appreciate your time exploring my API. If you have any questions, feedback, or run into any issues, feel free to reach out! 🚀

## 📬 Contact Information:
- Email: caetanojpo@gmail.com
- GitHub: https://github.com/caetanojpo
- LinkedIn: https://www.linkedin.com/in/caetanojpo

Looking forward to hearing from you!
