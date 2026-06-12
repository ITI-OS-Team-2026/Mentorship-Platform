# Product Requirements Document (PRD)
## Academic Mentorship & Code Review Platform

---

## 1. Project Overview
The Academic Mentorship & Code Review Platform is a role-based scheduling and mentorship application designed for technical learning environments. It allows junior developers to discover and book 45-minute code review sessions, pair programming evaluations, or mock interviews with technical experts. 

## 2. Technology Stack
### Frontend
* **Core:** React (JavaScript only, strictly no TypeScript)
* **Routing:** React Router v7 (Role-based dynamic routing)
* **Styling & UI:** TailwindCSS v4, shadcn/ui (Bootstrap is strictly prohibited)
* **State Management:** Zustand (for global application state)
* **Utilities:** `useDebounce` from the `usehooks` library (for search input optimization)

### Backend
* **Environment:** Node.js with Express.js
* **Database:** MongoDB (using Mongoose for Object Data Modeling)
* **Authentication:** JSON Web Tokens (JWT)
* **AI Integration:** Custom evaluation helper for processing text submission descriptions

---

## 3. User Roles & Permissions
The system operates on a unified authentication engine with strict Role-Based Access Control (RBAC).

* **Student (Junior Developer):** Can browse mentors, book sessions, manage their bookings (cancel/shift), and view evaluation feedback.
* **Mentor (Technical Expert):** Manages their weekly availability matrix, views incoming bookings, and appends evaluation notes. *Restriction: Mentors cannot book sessions with other mentors.*
* **Administrator:** Oversees platform integrity, manages system configurations (e.g., adding technical stacks), and moderates user verification/access.

---

## 4. Core Features & Required Pages

### 4.1 Frontend Routes
* **Discovery Engine (`/mentors`):** Main landing view with stack and keyword filters. Integrates `useDebounce` (e.g., 500ms delay) to govern backend API call rates during search.
* **Mentor Profile (`/mentors/:id`):** View specialized skills, rating matrices, and book open 45-minute scheduling segments.
* **Student Dashboard (`/student/dashboard`):** Track historical/pending sessions, cancel slots, and view feedback.
* **Mentor Dashboard (`/mentor/dashboard`):** Manage operational availability parameters and monitor pending reviews.
* **Admin Dashboard (`/admin/dashboard`):** Manage system categories (Stacks) and user moderation. Protected by `<Suspense>` and `React.lazy()` for code-splitting.
* **Auth Pages (`/login`, `/register`):** Role-segregated onboarding and unified login.
* **404 Not Found (`*`):** Catch-all interceptor for non-existent endpoints.

### 4.2 Booking Concurrency & Logic
* **Availability Calculation:** Unbooked 45-minute blocks are dynamically computed from the mentor's operating window.
* **Overlap Prevention:** The backend must execute mathematical verification (`Requested Start < Existing End` AND `Requested End > Existing Start`) to completely block overlapping bookings for the same mentor.
* **Timezone Standardization:** All scheduling timestamps must be stored in the MongoDB database in pure UTC. The frontend is responsible for converting UTC strings to the user's localized browser timezone.

---

## 5. Database Architecture (MongoDB/Mongoose)

Transitioning to NoSQL requires referencing documents utilizing `ObjectId`.

### Collections
1.  **users:**
    * `_id` [ObjectId], `email` (String, unique), `password_hash` (String), `role` (Enum: ['Admin', 'Mentor', 'Student']), `created_at` (Date).
2.  **stacks:**
    * `_id` [ObjectId], `name` (String, unique), `description` (String).
3.  **mentorProfiles:**
    * `_id` [ObjectId], `user_id` [ObjectId, ref: 'User', unique], `stack_id` [ObjectId, ref: 'Stack'], `name` (String), `title` (String), `bio` (String), `is_verified` (Boolean), `average_rating` (Number), `hourly_rate` (Number).
4.  **studentProfiles:**
    * `_id` [ObjectId], `user_id` [ObjectId, ref: 'User', unique], `name` (String).
5.  **mentorAvailabilities:**
    * `_id` [ObjectId], `mentor_id` [ObjectId, ref: 'MentorProfile'], `day_of_week` (Number/String), `start_time` (String), `end_time` (String).
6.  **reviewSessions:**
    * `_id` [ObjectId], `mentor_id` [ObjectId, ref: 'MentorProfile'], `student_id` [ObjectId, ref: 'StudentProfile'], `start_time` (Date UTC), `end_time` (Date UTC), `description` (String), `status` (Enum: ['Scheduled', 'Completed', 'Canceled']).
7.  **sessionAuditLogs:**
    * `_id` [ObjectId], `session_id` [ObjectId, ref: 'ReviewSession', unique], `predicted_tag` (String), `confidence_score` (Number), `status` (Enum: ['SUCCESS', 'FAILED']), `error_message` (String), `latency_ms` (Number).

*Note on Data Integrity:* Since MongoDB does not have built-in SQL cascade constraints, the Express.js controllers must manually handle related document deletions or state updates (e.g., if a session is canceled, the audit log may need updating).

---

## 6. API & Integration Guidelines
* **Security:** JWT verification middleware required for all protected routes. All secrets and AI tokens must be stored in a `.env` file.
* **AI Audit Pipeline:** Upon session creation, the Node.js backend must asynchronously pass the session's `description` text to the classification pipeline. Intercept exceptions via `try/catch` blocks to ensure the session booking succeeds even if the AI pipeline times out (saving the error in `sessionAuditLogs`).
* **CORS:** Cross-Origin Resource Sharing must be configured in Express to accept requests from the frontend port.
* **API Deliverables:** A Postman/Insomnia JSON collection must be maintained to verify request/response shapes.

---

## 7. UI/UX & Quality Enhancements
* **Theme Control:** Implement system-wide dark/light mode toggles via Context or Zustand overriding Tailwind configuration.
* **Skeleton Loaders:** Utilize shadcn Skeleton components to mask network latency during data fetching (e.g., waiting for Mentor profiles to load).
* **Toast Notifications:** Deploy toast components for all major state mutations (e.g., successful booking, login failure).
* **i18n Localization:** Structure components to support future translation files and Right-to-Left (RTL) CSS rule alterations.
