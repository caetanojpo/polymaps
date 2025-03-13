# Polymap Web
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13.x-lightblue)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-pink)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

A modern geospatial management interface built with Next.js and Atomic Design architecture.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a96044e3-3f8d-4d02-9856-75c292489c5b" width="400">
</p>

---

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Language**: TypeScript
- **Testing**: Jest + Supertest
- **Styling**: Tailwind CSS 4
- **Architecture**: Atomic Design

---

## ⚙️ Installation & Running

### Clone the repository:
```bash
git clone https://github.com/caetanojpo/polymaps.git
```

### Access folder:
```bash
cd polymaps/front
```

### Install dependencies:
```bash
npm install
```

### Run the application:
```bash
npm run dev
```

---

## 🔧 Configuration

Create a `.env` file using the `.env.local` template. Replace placeholders with actual values:
```bash
NEXT_PUBLIC_DEV_URL=http://localhost:8000
```

---

## 📚 Pages & Routes

The application has the following pages:

### 1. Login

- **URL**: `/`
- The landing page of the application with login to authenticate on the server.

![image](https://github.com/user-attachments/assets/6f2bb261-6d72-48cc-8f9a-90d512375a21)


### 2. Dashboard

- **URL**: `/dashboard`
- The user's main dashboard that provides insights and actions based on the application data.

![image](https://github.com/user-attachments/assets/c93d27ac-e207-43c4-ab57-dfa65111162b)

---

## 🧱 **Atomic Design in This Project**

In this project, we've adopted the Atomic Design methodology to build a scalable and maintainable UI. The components are structured into five levels:

- **Atoms**: Basic building blocks like buttons, inputs, and icons are designed as reusable components.
- **Molecules**: Combinations of atoms, like form groups or card components, that are more complex yet still reusable.
- **Organisms**: Combinations of molecules forming more complex UI structures, such as headers or product lists.
- **Templates**: Page layouts formed by organisms, defining the structure without specific content.
- **Pages**: Final instances of templates, populated with real content, ready for display.

This approach ensures modularity, reusability, and consistency across the UI, making the project easy to scale and maintain.

---

## 📐 Architecture
Application structure:
``` bash
src/
├── app/
│   ├── api/
│   │   ├── login/
│   │   ├── regions/
│   │   ├── signup/
├── dashboard/
├── globals.css
├── layout.tsx
├── page.tsx
│   ├── entities/
│   ├── repositories/
│   ├── exceptions/
│   ├── types/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
├── store/
├── types/
```

## 🎉 Thank you for your interest!
I really appreciate your time exploring my Web application. If you have any questions, feedback, or run into any issues, feel free to reach out! 🚀

## 📬 Contact Information:
- Email: caetanojpo@gmail.com
- GitHub: https://github.com/caetanojpo
- LinkedIn: https://www.linkedin.com/in/caetanojpo

Looking forward to hearing from you!
