# Admin Internship & Data Validation Portal (AI Proctored)

A powerful, SaaS-level platform designed for AI-powered interview monitoring, internship management, and data validation. This system features real-time risk assessment, proctoring events (face/object/audio), and a comprehensive admin dashboard for performance tracking.

## 🚀 Key Features

### 1. AI Proctored Interview System
*   **Real-time Monitoring**: Tracks face pose, object detection (e.g., cell phones), and audio transcripts.
*   **Risk Scoring**: Automatically calculates a total risk score based on detected anomalies.
*   **Session Playback**: Admins can review detailed session timelines with event logs.

### 2. Admin Dashboard & Management
*   **Analytics Overview**: Visualizes candidate performance and verification status using interactive charts.
*   **Search & Filtering**: Quick access to intern data by name, email, or status.
*   **Verification Workflow**: Multi-stage approval process (Pending, Verified, Rejected) with mandatory logic checks.
*   **Report Generation**: Export detailed intern performance reports in PDF and Excel formats.

### 3. Security & Auditing
*   **Secure Authentication**: JWT-based auth with encrypted passwords (bcrypt).
*   **Audit Logging**: Every admin action is tracked (IP, timestamp, action type) for accountability.
*   **Rate Limiting & Helmet**: Hardened backend API against common web vulnerabilities.

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, TanStack Query, Recharts, Lucide Icons |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL |
| **Security** | JSON Web Tokens (JWT), Bcrypt, Helmet, Express Rate Limit |
| **Utilities** | ExcelJS, PDFKit, Axios, Date-fns |

## 📂 Project Structure

```text
Admin Portal/
├── frontend/               # React Client
│   ├── src/
│   │   ├── api/            # API client (Axios) and endpoints
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views (Dashboard, Sessions, Login)
│   │   └── hooks/          # Custom React hooks (Auth, Logic)
├── backend/                # Express Server & API
│   ├── src/
│   │   ├── routes/         # API Route definitions
│   │   ├── controllers/    # Business logic
│   │   └── middleware/     # Auth & Security middleware
│   ├── prisma/             # Database schema (schema.prisma)
└── interview_db_...sql     # Database structure export
```

## ⚙️ How to Run

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL Database
*   npm or yarn

### 1. Database Setup
1.  Create a PostgreSQL database.
2.  Import the SQL structure from `interview_db_final_structure (1).sql` or use Prisma migrations.
3.  Configure your environment variables in `backend/.env`:
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/your_db"
    JWT_SECRET="your_secret_key"
    PORT=4000
    ```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.
The backend API will run at `http://localhost:4000`.

## 🔒 Security Practices
*   Passwords are never stored in plain text.
*   API endpoints are protected via JWT middleware.
*   Audit logs track critical data modifications.
*   Cross-Origin Resource Sharing (CORS) is strictly configured.

---


