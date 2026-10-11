# Student Event Registration & Participation System

A full-stack, enterprise-grade college web platform designed to streamline campus event discovery, seat booking, participant management, and verified attendance tracking for **Students**, **Event Organizers**, and **Administrators**.

---

## 1. Technology Stack

- **Frontend:** React 18, Vite, React Router DOM 6, Bootstrap 5, Bootstrap Icons, Fetch API with credentials
- **Backend:** Java 17+, Spring Boot, Spring Web REST API, Spring Data JPA / Hibernate, Spring Security, Maven
- **Database:** MySQL 8.x with relational tables, foreign keys, unique constraints, and transaction isolation (plus built-in H2 profile for zero-dependency instant demo & automated testing)
- **Tooling:** Bundled Node.js v20.18.0 & npm 10.8.2 portable tools, VS Code Tasks, `.cmd` one-click launch scripts
- **Testing:** JUnit 5, Spring Boot Test, Spring Security Test, MockMvc (18 automated integration tests)

---

## 2. Running in Visual Studio Code (Quick Start)

### Option 1: One-Click Run Scripts (Easiest)
From the project root directory or Windows Explorer, you can double-click or run:
- **`run-backend.cmd`** &mdash; Starts the Spring Boot backend on **port 8080** (with automatic database seeding).
- **`run-frontend.cmd`** &mdash; Starts the React frontend with Vite dev server on **port 5173** (with instant hot-reload and API proxy).

---

### Option 2: Using VS Code Terminal / Commands
Open the project root `d:\student_eventregistration` in VS Code and open two terminal tabs (`Ctrl + \``):

#### Terminal 1 (Backend - Spring Boot):
```powershell
cd student-event-system\backend
..\..\mvn.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
```
*(Backend starts at `http://localhost:8080`)*

#### Terminal 2 (Frontend - React + Vite):
```powershell
cd student-event-system\frontend-react
..\..\npm.cmd run dev
```
*(Vite Dev server starts at `http://localhost:5173` with automatic API proxy to `:8080`)*

---

### Option 3: Using VS Code Tasks Menu
1. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS).
2. Type **`Tasks: Run Task`** and hit Enter.
3. Select any task:
   - **`Start Backend (Instant Demo - H2 Profile)`** &mdash; Launches backend on port 8080.
   - **`Start React Frontend (Vite Dev Server)`** &mdash; Launches React dev server on port 5173.
   - **`Build React Frontend (Production)`** &mdash; Builds React production bundle into `dist/`.
   - **`Run Automated Integration Tests`** &mdash; Runs all 18 backend JUnit integration tests.

---

## 3. URLs & Default Credentials

| Portal | URL | Description |
|---|---|---|
| **Student Sign Up** | [http://localhost:5173/register](http://localhost:5173/register) | Dedicated Student Registration page |
| **Organizer Sign Up** | [http://localhost:5173/register-organizer](http://localhost:5173/register-organizer) | Dedicated Organizer & Faculty Registration page |
| **React Development App** | [http://localhost:5173/](http://localhost:5173/) | Vite hot-reload server (proxies `/api` to backend) |
| **Spring Boot Full App** | [http://localhost:8080/](http://localhost:8080/) | Direct Spring Boot app serving the built React SPA |
| **REST API Base** | `http://localhost:8080/api` | Spring Boot JSON REST endpoints |
| **H2 Database Console** | `http://localhost:8080/h2-console` | JDBC URL: `jdbc:h2:mem:student_event_system` |

### Default Demo Logins

The application automatically seeds verified accounts on startup:

| Role | Name | Email | Password |
|---|---|---|---|
| **Administrator** | System Administrator | `admin@college.edu` | `Admin@123` |
| **Organizer** | Dr. Sarah Jenkins | `sarah.jenkins@college.edu` | `Password@123` |
| **Organizer** | Prof. Michael Chang | `michael.chang@college.edu` | `Password@123` |
| **Student** | Alex Rivera | `alex.rivera@student.college.edu` | `Password@123` |
| **Student** | Emily Watson | `emily.watson@student.college.edu` | `Password@123` |
| **Student** | Rahul Sharma | `rahul.sharma@student.college.edu` | `Password@123` |
| **Student** | Jessica Lee | `jessica.lee@student.college.edu` | `Password@123` |

*(On the Login page, click any of the **Demo Accounts** buttons to auto-populate email & password instantly).*

---

## 4. System Features by Role

### A. Student Experience
- **Browse & Search:** Filter by category (*Technical, Cultural, Sports, Workshop, Seminar*), status, and date.
- **Seat Availability:** Real-time capacity progress indicators.
- **1-Click Registration:** Concurrency-guarded booking with duplicate booking prevention.
- **Digital Event Pass:** Printable entry ticket with simulated QR code, venue details, and registration ID.
- **Student Dashboard:** Metrics for active registrations, attendance count, and upcoming events.
- **Booking Cancellation:** Release seats with one click before the event starts.

### B. Event Organizer Experience
- **Organizer Dashboard:** Total sessions created, registration count, and verified attendees.
- **Event Publishing & Editing:** Set title, description, category, dates, timings, venue, and capacity limits.
- **Live Participant Roster:** View all registered students per event with instant search.
- **Live Attendance Marking:** Toggle student status between **PRESENT** and **ABSENT** with live attendance updates.

### C. Administrator Experience
- **Institutional Governance:** Overall student turnout ratios, total events, and registered accounts.
- **User Directory:** Search campus users, activate/deactivate accounts, and adjust roles (**STUDENT**, **ORGANIZER**, **ADMIN**).
- **Event Oversight:** Review cross-department events and cancel non-compliant listings.
- **Auditing & Reporting:** Filter attendance records by event and date range.
- **Official CSV Export:** Instant download of CSV reports for accreditation and records.

---

## 5. Project Directory Structure

```text
student-event-system/
├── backend/                                        # Spring Boot 3+ REST API Backend
│   ├── pom.xml                                     # Maven dependencies
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/college/event/
│   │   │   │   ├── StudentEventSystemApplication.java
│   │   │   │   ├── config/                        # SecurityConfig, SpaController, DataInitializer
│   │   │   │   ├── controller/                    # Auth, Event, Registration, Organizer, Admin, Student Controllers
│   │   │   │   ├── dto/                           # Request & Response Data Transfer Objects
│   │   │   │   ├── entity/                        # User, Event, Registration, Enums
│   │   │   │   ├── exception/                     # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── repository/                    # UserRepository, EventRepository, RegistrationRepository
│   │   │   │   └── service/                       # AuthService, EventService, RegistrationService, AdminService
│   │   │   └── resources/
│   │   │       ├── application.properties         # MySQL Database profile
│   │   │       ├── application-h2.properties      # Zero-setup H2 in-memory profile
│   │   │       └── static/                        # Production React build served on :8080
│   │   └── test/                                  # 18 Automated Integration Tests
│   └── target/                                    # Executable JAR
├── frontend-react/                                 # Modern React SPA Frontend
│   ├── package.json                                # React 18, React Router 6, Vite, Bootstrap
│   ├── vite.config.js                             # Proxy configuration to Spring Boot (:8080)
│   ├── index.html                                 # HTML template
│   └── src/
│       ├── main.jsx                               # React entry point
│       ├── App.jsx                                # Client-side routes & role protection
│       ├── index.css                              # Design system styling
│       ├── context/AuthContext.jsx                # Session auth state & user methods
│       ├── services/api.js                        # Fetch API client with credentials & CSV download
│       ├── components/                            # Navbar, Footer, ProtectedRoute, Badges
│       └── pages/                                 # Home, Login, Register, Events, Dashboards, Reports
├── database/
│   ├── schema.sql                                 # Relational MySQL tables & indexes
│   └── sample-data.sql                            # Sample users, events, and registrations
├── tools/                                         # Portable Node.js & npm runtime
├── run-backend.cmd                                # One-click script to start Spring Boot
├── run-frontend.cmd                               # One-click script to start React Vite
├── build-react.cmd                                # Script to build React and sync to backend static
└── README.md
```

---

## 6. Running with MySQL Server (Optional)

If you prefer to run against a standalone MySQL Server instead of the built-in H2 profile:

1. **Initialize Database:**
   ```powershell
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/sample-data.sql
   ```

2. **Configure Database Credentials:**
   Edit `backend/src/main/resources/application.properties` or set environment variables:
   ```powershell
   $env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/student_event_system?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
   $env:SPRING_DATASOURCE_USERNAME="root"
   $env:SPRING_DATASOURCE_PASSWORD="your_password"
   ```

3. **Start the Backend:**
   ```powershell
   cd student-event-system\backend
   ..\..\mvn.cmd spring-boot:run
   ```

---

## 7. Running Automated Tests

Run the full integration test suite:

```powershell
cd student-event-system\backend
..\..\mvn.cmd test
```

### Verified Business Rules Tested (18 Tests, 100% Pass Rate):
- `testStudentRegistrationSuccess` &mdash; Student registration with unique email
- `testDuplicateEmailRegistrationFails` &mdash; Duplicate email rejection (409 Conflict)
- `testLoginSuccessAndInvalidCredentials` &mdash; Auth validation & BCrypt verification
- `testPublicCanViewEvents` &mdash; Unauthenticated public events listing
- `testFilterEventsByCategory` &mdash; Filtering by category
- `testOrganizerCanCreateEvent` &mdash; Event creation authorized for Organizers
- `testStudentCannotCreateEvent` &mdash; Role enforcement (403 Forbidden for Students)
- `testEventInvalidTimesFails` &mdash; Start time after end time validation
- `testStudentRegisterSuccess` &mdash; Seat booking & attendance pending status
- `testDuplicateRegistrationFails` &mdash; Student cannot register twice for same event
- `testPastEventRegistrationFails` &mdash; Student cannot register for past events
- `testCapacityRestrictionEnforcement` &mdash; Registrations rejected when capacity is full
- `testMarkAttendanceForRegisteredStudent` &mdash; Organizer attendance update (Present/Absent)
- `testAdminCanAccessDashboard` &mdash; System KPI metrics retrieval
- `testStudentForbiddenFromAdminDashboard` &mdash; Admin route security guard
- `testAdminCanListAndToggleUserStatus` &mdash; Account activation & deactivation
- `testAdminReportsAndCsvExport` &mdash; Analytical report summaries & CSV download

---

## 8. Common Troubleshooting

1. **Port 8080 or 5173 already in use:**
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
   ```
2. **Rebuilding React into Spring Boot:**
   Run `.\build-react.cmd` from the root directory. It compiles the React application and copies the artifacts into `backend/src/main/resources/static/` so Spring Boot serves the production bundle directly.
