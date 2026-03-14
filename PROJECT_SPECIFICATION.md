# Project Specification: Admin Internship & Data Validation Portal

## 1. Project Overview
The **Admin Internship & Data Validation Portal** is a sophisticated full-stack application designed to manage the vetting and performance evaluation of interns. It leverages AI-assisted proctoring data to provide administrators with a risk-adjusted view of candidate performance during technical assessments.

## 2. System Architecture
The platform follows a modern decoupled architecture:
*   **Frontend**: A Single Page Application (SPA) built with React and Vite.
*   **Backend**: A RESTful API built with Node.js and Express.
*   **Data Layer**: A PostgreSQL database orchestrated via Prisma ORM for type-safe queries and schema management.

## 3. Core Modules & Functionalities

### A. Admin Authentication System
*   **Registration**: Allows new administrators to join via a secure signup flow.
*   **Security**: Implements Argon2/Bcrypt password hashing and JSON Web Tokens (JWT) for session persistence.
*   **Authorization**: Middleware ensures only authenticated admins can access protected routes.

### B. Internship Management Dashboard
*   **Live Metrics**: Displays key performance indicators (KPIs) such as Total Candidates, Verification Rate, and Flagged Sessions.
*   **Data Visualization**: Uses Recharts to show trends in risk scores and performance across time.
*   **Search Engine**: Real-time filtering system for names, emails, and departments.

### C. AI Proctoring & Data Validation
*   **Anomaly Detection**: Monitors face orientation, presence of prohibited objects, and audio interference.
*   **Risk Scoring Algorithm**: Dynamically calculates scores based on event frequency and severity.
*   **Session Lifecycle**: Tracks sessions from "In Progress" to "Completed" or "Flagged".

### D. Compliance & Reporting
*   **Audit Trail**: Logs all modifications made by administrators for security auditing.
*   **Automated Verification**: Implements business logic to verify candidates based on minimum score thresholds and session completion.
*   **Multi-format Export**: Supports professional PDF and Excel reports for offline review.

## 4. Technical Requirements

### Frontend Dependencies
*   **State Management**: TanStack Query for server-state caching.
*   **Styling**: Vanilla CSS and Tailwind CSS for a premium SaaS aesthetic.
*   **Icons**: Lucide React for consistent visual language.
*   **Routing**: React Router for navigation.

### Backend Dependencies
*   **API Stability**: Morgan for logging and Helmet for HTTP security headers.
*   **Performance**: Express Rate Limit for DDoS protection.
*   **Reporting**: ExcelJS for spreadsheet generation and PDFKit for document creation.

## 5. Development Workflow
*   **Database Management**: Use Prisma Studio for direct data visualization and migrations for schema evolution.
*   **API Testing**: REST client or Postman for validating endpoints.
*   **Environment Parity**: `.env` files used across environments to manage secrets and connections.

---
*Last Updated: March 2024*
