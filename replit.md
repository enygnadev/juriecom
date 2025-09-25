# Overview

This is a specialized e-commerce platform for legal services called "Despachante DevTools". It's designed specifically for Brazilian legal document processing services (despachante services), allowing customers to purchase and manage legal services online. The platform provides a complete digital solution for legal document processing, vehicle registration, licensing, and other bureaucratic services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application is built using Next.js 15 with TypeScript, leveraging the App Router architecture. The frontend follows a modern React pattern with:
- **Component-based architecture** using shadcn/ui components for consistent UI
- **State management** through custom providers and stores for cart, authentication, and global state
- **Client-side routing** with Next.js App Router for seamless navigation
- **Responsive design** built with Tailwind CSS for mobile-first experiences
- **Real-time interactions** using React hooks and context providers

## Backend Architecture
The backend utilizes Firebase as the primary infrastructure:
- **Firestore Database** for storing products, orders, users, and settings
- **Firebase Authentication** for user management with email/password and Google OAuth
- **Firebase Storage** for file uploads and document management
- **Server-side API routes** in Next.js for business logic and data processing
- **Role-based access control** with admin and customer user types

## Authentication & Authorization
- **Firebase Auth** handles user authentication with multiple providers
- **Role-based permissions** using Firestore user profiles with admin flags
- **Protected routes** through middleware and client-side auth checks
- **Session management** with automatic token refresh and persistence

## Data Architecture
The application uses Firestore collections for:
- **Products** - Legal services with descriptions, pricing, and required documents
- **Orders** - Customer orders with status tracking and payment information
- **Users** - User profiles with roles and preferences
- **Categories** - Service categorization and filtering
- **Settings** - Application configuration and store settings

## Design Patterns
- **Provider pattern** for global state management (Auth, Cart, Theme)
- **Component composition** with reusable UI components
- **Custom hooks** for business logic abstraction
- **Template system** for legal document requirements per service type

# External Dependencies

## Core Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Backend-as-a-Service platform

## UI Components
- **Radix UI** - Headless component primitives for accessibility
- **shadcn/ui** - Pre-built component library
- **Framer Motion** - Animation library for smooth interactions
- **Lucide React** - Icon library

## Authentication & Database
- **Firebase Auth** - User authentication service
- **Firestore** - NoSQL document database
- **Firebase Storage** - File storage service
- **Firebase Admin SDK** - Server-side Firebase operations

## Development Tools
- **ESLint** - Code linting and formatting
- **pnpm** - Package manager
- **Vercel** - Deployment platform (configured)

## AI Integration
- **OpenAI API** - Chatbot functionality for customer support
- **AI SDK** - Stream-based AI responses for chat interactions

## Payment & Communication
- **PIX integration** - Brazilian instant payment system
- **WhatsApp integration** - Customer communication channel
- **Email notifications** - Order confirmations and updates

## File Management
- **Document upload system** - For legal document submissions
- **Image optimization** - Next.js Image component for performance
- **Template-based document management** - Structured approach to required documents per service