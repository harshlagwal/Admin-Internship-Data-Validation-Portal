# Admin Portal Backend

The Node.js/Express backend for the Admin Internship & Data Validation Portal. This server handles authentication, session management, risk scoring, and data exports.

## 🛠️ Features
- **Scalable API**: Decoupled routes for Candidates, Sessions, and Audit Logs.
- **ORM Integration**: Type-safe database interactions with Prisma.
- **Security First**: 
  - JWT for stateless authentication.
  - Helmet for security headers.
  - Rate limiting to prevent abuse.
  - Audit logging for administrative actions.
- **Reporting Engine**: Generates dynamic PDF and Excel reports using PDFKit and ExcelJS.

## 📦 Key Dependencies
- **Express**: Fast, unopinionated, minimalist web framework.
- **Prisma**: Next-generation Node.js and TypeScript ORM.
- **PostgreSQL**: Robust relational database.
- **Bcrypt**: Library for hashing passwords.
- **PDFKit & ExcelJS**: Core tools for generating downloadable reports.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/admin_portal"
   JWT_SECRET="your_very_secret_key"
   PORT=4000
   ```

3. **Database Migration**:
   ```bash
   npx prisma migrate dev
   ```

4. **Run Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Folder Structure
- `/src/routes`: Express router definitions.
- `/src/controllers`: Request handlers and business logic.
- `/src/middleware`: Auth validation and error handling.
- `/prisma`: Schema definition and migrations.

---

*Part of the Admin Internship & Data Validation Portal*
