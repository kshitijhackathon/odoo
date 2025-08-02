# CivicTrack - Civic Issue Tracking Platform

## Overview

CivicTrack is a full-stack civic engagement platform that allows citizens to report, track, and interact with local issues such as garbage collection, water problems, road maintenance, and traffic concerns. The application features an interactive map interface where users can visualize issues geographically, report new problems, and follow the progress of existing issues through their lifecycle from reported to resolved status.

The platform is built as a modern web application with a React frontend and Express backend, designed to facilitate community engagement and improve municipal responsiveness to citizen concerns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript throughout the entire stack for consistency and type safety
- **Database Integration**: Drizzle ORM for type-safe database operations and schema management
- **API Design**: RESTful endpoints following conventional patterns (/api/issues, /api/comments, etc.)
- **Error Handling**: Centralized error middleware for consistent error responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL hosting
- **Schema Management**: Drizzle migrations for version-controlled database schema changes
- **Connection**: PostgreSQL session management with connect-pg-simple for session storage

### Key Data Models
- **Issues**: Core entity with geolocation (latitude/longitude), category, status, images, and voting
- **Users**: Authentication and user management with verification status
- **Comments**: Threaded commenting system with moderation capabilities
- **Votes**: User voting system for issue prioritization
- **Status History**: Audit trail for issue status changes
- **Follows**: User subscription system for issue updates

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL storage
- **User System**: Username/email-based authentication with email verification
- **Anonymous Reporting**: Support for anonymous issue reporting
- **Moderation**: Content flagging and hiding system for community moderation

### Geographic Features
- **Mapping**: Interactive map interface for visualizing issues spatially
- **Geolocation**: Browser geolocation API integration for location-based features
- **Filtering**: Geographic radius-based filtering for local issue discovery
- **Address Geocoding**: Address resolution for human-readable locations

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support

### Development Tools
- **Vite**: Modern build tool with HMR for development and optimized production builds
- **ESBuild**: Fast JavaScript bundler for server-side code compilation
- **Replit Integration**: Development environment plugins for Replit hosting

### UI Libraries
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Consistent icon library for UI elements
- **Embla Carousel**: Touch-friendly carousel component for image galleries
- **CMDK**: Command palette component for enhanced user interactions

### Validation and Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Performant form library with minimal re-renders
- **Hookform Resolvers**: Integration layer between React Hook Form and Zod

### Utility Libraries
- **Date-fns**: Modern date utility library for time formatting and manipulation
- **Class Variance Authority**: Utility for creating type-safe component variants
- **Tailwind Merge**: Intelligent Tailwind class merging for component composition