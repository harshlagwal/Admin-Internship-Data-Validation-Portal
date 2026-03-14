# Admin Portal Frontend

This is the React-based frontend for the Admin Internship & Data Validation Portal. It provides a highly interactive and responsive interface for administrators to monitor sessions, manage candidates, and view analytics.

## 🛠️ Features
- **Responsive Dashboard**: Mobile-first design with a collapsible sidebar and clean typography.
- **Real-time Search**: Instant filtering of candidates and sessions.
- **Analytics Visualization**: Interactive graphs and charts for performance tracking.
- **Auth Integration**: Secure login and signup flows with local storage for JWT management.
- **PDF/Excel Downloads**: One-click report generation.

## 📦 Key Dependencies
- **Vite**: Ultra-fast build tool and dev server.
- **React 19**: Utilizing the latest React features.
- **Tailwind CSS**: Utility-first styling for premium design.
- **TanStack Query (v5)**: Powerful data fetching and caching.
- **Recharts**: Responsive charting library.
- **Lucide React**: Beautifully crafted icons.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in this directory (if needed for API URLs):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Folder Structure
- `/src/api`: Axios client and API endpoint definitions.
- `/src/components`: UI primitives (Buttons, Inputs, Cards).
- `/src/pages`: Main view components (Dashboard, Sessions, etc.).
- `/src/layouts`: Wrapper components for consistent page structure.
- `/src/hooks`: Custom logic for authentication and data management.

---

*Part of the Admin Internship & Data Validation Portal*
