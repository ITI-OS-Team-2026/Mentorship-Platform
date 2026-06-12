# Academic Mentorship & Code Review Platform

## Project frontend Overview
The application is a role-based mentorship and scheduling system designed for technical learning environments. Instead of booking medical appointments, junior developers (Students) browse technical experts (Mentors) to book 45-minute code review sessions, pair programming evaluations, or mock interviews. Mentors manage their weekly availability slots and evaluate submissions, while administrators oversee platform integrity, configurations, and technical category expansions.

UI Framework & Constraints: You must construct the entire user interface utilizing shadcn/ui, TailwindCSS. Bootstrap is strictly prohibited. All navigation configurations must utilize dynamic role-based routing through React Router.

## Required Pages

Develop a single-page application containing the following routes, structured safely with comprehensive 404 error catching parameters.

- Mentor Search / Discovery (Main landing view with functional tech-stack and keyword filters)
- Mentor Profile & Session Booking (View specialized skill matrices, open scheduling segments, and book slots)
- Student Dashboard (Track booked reviews, cancel incoming slots, view text evaluations/feedback, or update profile)
- Mentor Dashboard (Establish operating availability parameters, monitor pending reviews, append evaluation notes)
- Admin Dashboard (Moderate user access, approve/block mentor requests, scale technical system categories)
- Login (Unified authentication engine covering all security access levels)
- Register (Onboarding portal with role segregation options for Students and Mentors)
- Profile Customization (Contextual workspace to adjust operational technical profiles)
- 404 Not Found (Catch-all visual wrapper intercepting non-existent endpoints)

---

## Core Functional Requirements
### Student Capabilities
- Discovery Engine: Browse an optimized index of technical mentors equipped with functional sorting filters for specific programming stacks (e.g., Python, React, Go) and developer titles.
- Session Reservation: Interrogate a mentor's open schedule parameters and safely secure an isolated 45-minute code evaluation slot.
- Session Management: Monitor historical, current, or pending sessions from a tailored workspace. Support full capabilities to cancel, shift, or review evaluations.
- Concurrency Protection: Implement bulletproof client-side and structural checks ensuring no two students can successfully book the exact same mentor inside the same time interval.
- Sorting Metrics: Arrange active mentors using specialized query configurations tracking rating systems, price matrices, or current availability (e.g., sort_by=rating).
- Roster Pagination: Dynamically page large indices of matching mentors and structural administration tables via active URL modifications (e.g., page=3).
- Search Input Debouncing: Force a deliberate processing interval (e.g., 500ms delay) upon the discovery input interface to safely govern backend API call rates.

### Mentor & Admin Capabilities
- Availability Matrix: Empowers technical mentors to define their operating weekly schedule thresholds (specifying exact active dates, hours, and days).
- Evaluation Workspace: Monitor upcoming review schedules, modify biographical profile matrices, toggle slot approval status, and explicitly append code evaluation notes.
- User Moderation Core: Provides administrators structural authority to inspect user lists, approve incoming technical mentor applications, or block non-compliant accounts.
- Configuration Control (CRUD): Allow administrative accounts to dynamically construct, read, update, and delete configuration files, target system categories (e.g., adding "System Design" or "DevOps"), and monitor sessions system-wide.

### UI Enhancements & Auth
- Component Implementation: Explicitly style interfaces utilizing clean library elements. Ensure absolute avoidance of standard default styles or illegal frameworks.
- Secure Session Extraction: Conduct reliable authorization and user session maintenance using JSON Web Tokens (JWT) mapped through your Django REST Framework or Laravel backend endpoints.
- Data Stream Control: Govern complex form interactions, client validations, and overarching state variables safely through Context API or Redux Toolkit.
- Interface Upgrades: Build highly responsive interface components including dynamic, contextual document tab title indicators alongside structured Back to Top mechanics.
- User Toast Notifications: Deliver immediate visual system confirmations or clean error updates using high-quality notification packages following key state mutations.
- Skeletons & Fallbacks: Generate explicit library Skeleton wrappers to mask background network lookups. Deploy clean, illustrative empty-state containers if active list indicators fall to zero.

### Architecture & Best Practices
- Role-Based Route Execution: Intercept and partition insecure access using strict React Router structural guards to isolate student workspaces, mentor profiles, and admin domains.
- API Resilience Rules: Intercept data transaction exceptions at the view or network layer, presenting elegant error context to the client using visual alerts.
- Theme Swapping: Implement a system-wide theme context controller executing clean dark/light mode CSS overrides safely.
- Decoupled Custom Hooks: Isolate component render tracks from raw network protocols by creating modular hooks or tailored Axios instance engines.
- i18n Localization: Establish full structural internationalization capabilities, seamlessly translating interface text nodes and altering layouts to complete Right-to-Left (RTL) rules for Arabic fields.
- Route Lazy Loading: Enhance production initialization benchmarks by utilizing React.lazy() coupled with <Suspense> to separate massive route modules like the Admin Workspace.



---

# Academic Mentorship & Code Review Platform

## Backend Architecture Specification

---

## Part 1: The Scenario & Problem Context

Backend systems exist to govern data pipelines, protect integrity rules, and expose secure communication endpoints. This system serves as the backend core for an **Academic Mentorship & Code Review Platform**.

### The System Ecosystem

* **Stacks (Tech Categories):** Represent distinct learning domains (e.g., `"React Engineering"`, `"Python Systems"`, or `"System Design"`). Every Stack is tracked with a unique identity name and a technical summary description outlining its competency benchmarks.
* **Mentors (Technical Experts):** The platform captures their full name, bio details, and professional verification status. A Mentor is assigned to exactly one primary technical Stack, while a single Stack houses many matching Mentors.
* **Students (Junior Developers):** To manage enrollment vectors safely, the system explicitly logs each Student's full registration name, date of profile creation, and contact parameter flags.
* **Review Sessions (Core Transaction):** Generated when a student requests a consultation or portfolio audit. Each Session logs the targeted date and time, the student's submission description (e.g., *"Reviewing an asynchronous race condition in my Node engine"*), and the current operational booking status (`'Scheduled'`, `'Completed'`, or `'Canceled'`). A Review Session is strictly linked to exactly one Mentor and exactly one Student.

### The Real-World System Bottleneck

Because peer evaluations are time-sensitive, the platform requires automated auditing. When a student schedules a Review Session, the backend must pass that text submission description directly to a code classification pipeline.

The evaluation engine returns a **Session Audit Log** containing an auto-generated technical tag and a prediction confidence metric. This log must be safely preserved and linked directly back to the session, allowing mentors to review structural notes before the meeting kicks off.

---

## Part 2: Ecosystem Capabilities & System Rules

### ⚙️ Core Functional Boundaries

* **Admin Management:** Administrators must be able to perform standard CRUD operations on system Stacks and global platform settings.
* **Verification Workflows:** Administrators must be able to monitor and manage verification flags on matching Mentor instances.
* **Unified Authentication:** The system must support Student and Mentor sign-up procedures, exposing unified JWT tokens upon login.
* **Discovery Engine:** The application must allow users to query active lists of available Mentors with query-based pagination, title keyword searches, and stack sorting filters.
* **Dynamic Booking:** Students must be able to book individual 45-minute consultation slots calculated dynamically from mentor availability blocks.
* **Automated Pipeline Interception:** The backend engine must automatically intercept valid session bookings, pass the text to an evaluation helper, extract analytics parameters, and preserve an independent Session Audit Log.

### 🏗️ Structural Constraints & Data Integrity

* **Relational Enforcement:** The data persistence tier must run strictly via relational SQL rules to completely eliminate orphan records or missing audit history.
* **Cascade Protections:** Data integrity rules (Foreign Keys and Cascade protections) must be strictly implemented at the table constraints tier.
* **Concurrency Verification Block:** Bookings must run through a database transaction with strict isolation logic. The engine must reject bookings where:

$$\text{Requested Start Time} < \text{Existing Session End Time}$$


$$\text{and}$$


$$\text{Requested End Time} > \text{Existing Session Start Time}$$



*(Evaluated specifically for the requested mentor)*.
* **Transactional Atomicity:** The architecture must enforce strict atomicity: if the Session Audit Log fails to instantiate, the Review Session booking must rollback cleanly to prevent data inconsistencies.

---

## Part 3: Database Architecture

Regardless of the chosen backend framework, your tables must strictly mirror this relational column specification layout:

| Entity (Table) | Attributes (Columns) | Description / Integrity Rule |
| --- | --- | --- |
| **User** | `id` [PK], `email` (Unique), `password_hash`, `role` (Admin/Mentor/Student), `created_at` | Central identity store. Handles unified JWT authentication and strict Role-Based Access Control (RBAC) routing. |
| **Stack** | `id` [PK], `name` (Unique), `description` | Technical domains (e.g., Python Systems, React Engineering). |
| **MentorProfile** | `id` [PK], `user_id` [FK/Unique], `stack_id` [FK], `name`, `title`, `bio`, `is_verified` (bool), `average_rating` (float), `hourly_rate` (decimal) | The expert profile tied 1:1 to a User. Includes custom professional titles, admin verification toggles, and sorting metrics requested by the frontend. |
| **MentorAvailability** | `id` [PK], `mentor_id` [FK], `day_of_week`, `start_time`, `end_time` | Weekly operating windows. Interrogated by the client using targeted date parameters to dynamically compute available, unbooked 45-minute blocks. |
| **StudentProfile** | `id` [PK], `user_id` [FK/Unique], `name` | The junior developer profile tied 1:1 to a User. |
| **ReviewSession** | `id` [PK], `mentor_id` [FK], `student_id` [FK], `start_time`, `end_time`, `description`, `status` (Scheduled/Completed/Canceled) | The central transaction. Evaluated under isolation rules to mathematically prevent timeline overlaps during concurrent bookings. |
| **SessionAuditLog** | `id` [PK], `session_id` [FK/Unique], `predicted_tag`, `confidence_score` (float), `status` (SUCCESS/FAILED), `error_message`, `latency_ms` | Preserves a log of external execution telemetry metadata. |

---

## Part 4: Cardinality & Participation Mapping

Before coding your entities, evaluate these structural data linkages:

```
[Stack] 1 -------- N [Mentor]
                       1
                       |
                       | 1
                    [User]
                       | 1
                       |
                       1
                   [Student]

[Mentor]  1 -------- N [ReviewSession]
[Student] 1 -------- N [ReviewSession] 1 -------- (0 or 1) [SessionAuditLog]

```

* **Stack to Mentor ($1:N$):** One Stack houses many Mentors. A Mentor must belong to exactly one primary technical category. Participation is **Total** on the Mentor side.
* **Mentor to ReviewSession ($1:N$):** One Mentor hosts many Review Sessions. A Session must have an assigned Mentor. Participation is **Total** on the Session side.
* **Student to ReviewSession ($1:N$):** One Student requests many Review Sessions over their lifetime. Participation is **Total** on the Session side.
* **ReviewSession to SessionAuditLog ($1:1$ Case B):** One Review Session is processed to map exactly one Session Audit Log. Participation is **Partial** on the Session side (if a session has just been logged but not processed yet) and **Total** on the Audit Log side.

> ### 💡 Architectural Insight for AI Engineers
> 
> 
> Notice that while Students and Mentors share a theoretical Many-to-Many connectivity matrix, it is completely resolved at the data tier using the **ReviewSession** entity as a Resolution / Junction Table.

---

## Part 5: Framework Execution Blueprints

### Express.js (JavaScript)

* **Best For:** Completely unopinionated lightweight freedom, demanding explicit manual folder architecture setup.
* **Architecture:** Build a highly modular directory pattern manually, creating `controllers/`, `routes/`, and `models/`.
* **Data Layer:** Utilize`Mongoose` to govern data-layer validation interfaces.
* **Security:** Enforce authentication checking via independent, custom middleware functions.

---

## Part 6: API Protection & Integration

### 🛡️ Guarding the Gateway

1. **Environment Variables Encapsulation:** All database passwords and external AI authorization tokens must live inside a root-level `.env` file. Under no circumstances should secrets be hardcoded into project setting files. Ensure `.env` is added to `.gitignore`.
2. **JWT Token Evaluation:** Restrict booking and modification access points. The client must present a valid `Bearer <token>` authorization header before access is granted.
3. **Robust Telemetry Tracking:** Implement secure exception blocks (`try/catch` or `try/except`) wrapping all external model executions. Network requests will fail; if an outage occurs, intercept the error payload, log the `error_message` directly to your table row, and preserve system uptime.

### 📦 Submission Rule

All chosen project backends must provide a comprehensive, functional API collection mapping (**Postman** or **Insomnia** JSON collection file). The file must verify clean request/response data shapes across all endpoints listed in the companion React frontend specification.

---

## 🛠️ Developer Guidelines

* **CORS Policy:** Since your React frontend will live on a different port than your backend server, remember to explicitly configure and allow Cross-Origin Resource Sharing (CORS) header parameter tokens, or your client will face network connection locks!
* **Database Validation:** Enforce uniqueness constraints directly at the database engine level for critical text vectors like user registration emails to eliminate duplicate table data.

*With My Best Wishes!* — **Hassan ELDash** 💖