# Student Event Registration & Participation System

A full-stack, enterprise-grade college web platform designed to streamline campus event discovery, seat booking, participant management, and verified attendance tracking for **Students**, **Event Organizers**, and **Administrators**.

---

## 1. Technology Stack

- **Backend:** Java 17+, Spring Boot, Spring Web REST API, Spring Data JPA / Hibernate, Spring Security, Maven
- **Database:** MySQL 8.x with relational tables, foreign keys, unique constraints, and transaction isolation (plus built-in H2 profile for zero-dependency instant demo & automated testing)
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Bootstrap Icons, Fetch API
- **Testing:** JUnit 5, Spring Boot Test, Spring Security Test, MockMvc (18 automated integration tests)

---

## 2. System Architecture & Features

### A. Student Portal
- **Account Registration & Login:** Form validation, BCrypt password hashing, session authentication.
- **Event Catalog & Search:** Live keyword search (title, description, venue), category filtering (*Technical*, *Cultural*, *Workshop*, *Sports*, *Seminar*), date picker, and status filters.
- **Event Details & Live Seat Counters:** Visual capacity progress bar showing remaining seats in real time.
- **Event Registration:** Instant seat booking, atomic capacity enforcement, past-event prevention, and duplicate booking prevention.
- **My Registrations & Entry Pass:** List of active bookings, printable registration entry pass with reference ID, and one-click cancellation with instant seat release.
- **Student Dashboard:** Metrics for active registrations, upcoming events, verified attendance credits, and missed events.

### B. Event Organizer Portal
- **Organizer Dashboard:** Total events created, active student bookings, remaining capacity across events, attendance rate %.
- **Event Management:** Create and edit events with Title, Category, Date, Start Time, End Time, Campus Venue, and Positive Capacity.
- **Participant Roster & Attendance:** Searchable student participant table for each organized event.
- **Live Attendance Marking:** One-click toggles to mark students as **PRESENT** or **ABSENT** with real-time statistics updates.
- **Roster Export:** Download event attendee rosters directly to CSV.

### C. Administrator Portal
- **System-Wide Dashboard:** Total students, organizers, administrators, events by status, and overall attendance verification rates.
- **User Governance:** Search user directory, toggle account active/deactivate status (blocking or restoring login access), and assign system roles (**STUDENT**, **ORGANIZER**, **ADMIN**).
- **Event Governance:** Global oversight of all campus events across departments with administrative edit and cancellation capabilities.
- **Reports & Analytics:**
  - Event-wise registration counts and fill rates (%)
  - Student participation history & attendance tallies
  - Attendance breakdown (Present, Absent, Pending)
  - Date-wise event summaries
- **Official CSV Export:** Generate and download live audit reports in CSV format with real database records.

---

## 3. Project Structure

```text
student-event-system/
├── backend/
│   ├── mvnw.cmd                                    # Windows Maven wrapper
│   ├── pom.xml                                     # Maven dependencies and build plugins
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/college/event/
│   │   │   │   ├── StudentEventSystemApplication.java
│   │   │   │   ├── config/                        # SecurityConfig, CustomUserDetailsService, DataInitializer
│   │   │   │   ├── controller/                    # Auth, Event, Registration, Organizer, Admin, Student Controllers
│   │   │   │   ├── dto/                           # Request & Response Data Transfer Objects
│   │   │   │   ├── entity/                        # User, Event, Registration, Enums (Role, EventStatus, etc.)
│   │   │   │   ├── exception/                     # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── repository/                    # UserRepository, EventRepository, RegistrationRepository
│   │   │   │   └── service/                       # AuthService, EventService, RegistrationService, AdminService
│   │   │   └── resources/
│   │   │       ├── application.properties         # Primary MySQL configuration
│   │   │       ├── application-h2.properties      # Zero-dependency local/demo profile
│   │   │       └── static/                        # Serves frontend directly at http://localhost:8080/
│   │   └── test/                                  # 18 Automated Integration & Business Rule Tests
│   └── target/                                    # Built artifacts & executable JAR
├── frontend/                                      # Standalone HTML5 / CSS3 / JS files
│   ├── index.html                                 # Landing page with hero banner & live counters
│   ├── login.html                                 # Login page with 1-click demo login buttons
│   ├── register.html                              # Student and Organizer registration
│   ├── events.html                                # Events catalog with live search & registration modal
│   ├── student-dashboard.html                     # Student overview & recent activity
│   ├── my-registrations.html                      # Active bookings & printable entry pass
│   ├── organizer-dashboard.html                   # Organizer metrics & event list
│   ├── organizer-event-form.html                  # Create and edit event forms
│   ├── organizer-participants.html                # Participant roster & attendance management
│   ├── admin-dashboard.html                       # Campus administration metrics
│   ├── admin-users.html                           # User account management & role assignments
│   ├── admin-events.html                          # Cross-department event governance
│   ├── admin-reports.html                         # Institutional reports & CSV export
│   ├── profile.html                               # Profile & password updates
│   ├── access-denied.html                         # 403 Forbidden page
│   ├── 404.html                                   # 404 Not Found page
│   ├── css/style.css                              # Custom college branding design system
│   └── js/                                        # api.js, auth.js, app.js
├── database/
│   ├── schema.sql                                 # MySQL database table definitions & indexes
│   └── sample-data.sql                            # Sample users, events, registrations & BCrypt hashes
└── README.md
```

---

## 4. Default Seeded Credentials

The application automatically seeds the following verified accounts on startup:

| Role | Name | Email | Password |
|---|---|---|---|
| **Administrator** | System Administrator | `admin@college.edu` | `Admin@123` |
| **Organizer** | Dr. Sarah Jenkins | `sarah.jenkins@college.edu` | `Password@123` |
| **Organizer** | Prof. Michael Chang | `michael.chang@college.edu` | `Password@123` |
| **Student** | Alex Rivera | `alex.rivera@student.college.edu` | `Password@123` |
| **Student** | Emily Watson | `emily.watson@student.college.edu` | `Password@123` |
| **Student** | Rahul Sharma | `rahul.sharma@student.college.edu` | `Password@123` |
| **Student** | Jessica Lee | `jessica.lee@student.college.edu` | `Password@123` |

*(On `login.html`, click the quick-fill buttons to populate credentials instantly.)*

---

## 5. Setup & Execution Instructions

### Prerequisites
- **Java:** JDK 17 or higher (tested with OpenJDK 25)
- **Maven:** 3.9+ (bundled wrapper `mvnw.cmd` included in project)
- **MySQL:** MySQL Server 8.x (optional: built-in H2 profile enables immediate running without MySQL)

---

### Option A: Running with MySQL (Production / Local Database)

1. **Start MySQL Server:**
   Ensure MySQL is running on `localhost:3306`.

2. **Execute Database Scripts:**
   Open MySQL Workbench, MySQL Shell, or command line:
   ```powershell
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/sample-data.sql
   ```

3. **Configure Database Credentials:**
   Default credentials in `backend/src/main/resources/application.properties` are `root` / `root`.
   You can override them via environment variables:
   ```powershell
   $env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/student_event_system?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
   $env:SPRING_DATASOURCE_USERNAME="root"
   $env:SPRING_DATASOURCE_PASSWORD="your_password"
   ```

4. **Start the Backend:**
   ```powershell
   cd d:\student_eventregistration\student-event-system\backend
   .\mvnw.cmd spring-boot:run
   ```

---

### Option B: Running with In-Memory Database (Instant Demo / Zero-Setup)

If MySQL is not currently running on your system, you can start the application immediately with the built-in `h2` profile:

```powershell
cd d:\student_eventregistration\student-event-system\backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
```

---

## 6. Accessing the Application

Once Spring Boot is started:

- **Web Application URL:** [http://localhost:8080/](http://localhost:8080/)
- **Events Catalog:** [http://localhost:8080/events.html](http://localhost:8080/events.html)
- **Login Portal:** [http://localhost:8080/login.html](http://localhost:8080/login.html)
- **API Base URL:** `http://localhost:8080/api`

*(Alternatively, you can open `frontend/index.html` directly in your browser. The included `js/api.js` automatically directs Fetch calls to `http://localhost:8080/api` with credentials enabled).*

---

## 7. Running Automated Tests

Run the test suite containing 18 automated integration tests:

```powershell
cd d:\student_eventregistration\student-event-system\backend
.\mvnw.cmd test
```

### Verified Business Rules Tested:
- `testStudentRegistrationSuccess` — Student registration with unique email
- `testDuplicateEmailRegistrationFails` — Duplicate email rejection (409 Conflict)
- `testLoginSuccessAndInvalidCredentials` — Auth validation & BCrypt verification
- `testPublicCanViewEvents` — Unauthenticated public events listing
- `testFilterEventsByCategory` — Filtering by category
- `testOrganizerCanCreateEvent` — Event creation authorized for Organizers
- `testStudentCannotCreateEvent` — Role enforcement (403 Forbidden for Students)
- `testEventInvalidTimesFails` — Start time after end time validation
- `testStudentRegisterSuccess` — Seat booking & attendance pending status
- `testDuplicateRegistrationFails` — Student cannot register twice for same event
- `testPastEventRegistrationFails` — Student cannot register for past events
- `testCapacityRestrictionEnforcement` — Registrations rejected when capacity is full
- `testMarkAttendanceForRegisteredStudent` — Organizer attendance update (Present/Absent)
- `testAdminCanAccessDashboard` — System KPI metrics retrieval
- `testStudentForbiddenFromAdminDashboard` — Admin route security guard
- `testAdminCanListAndToggleUserStatus` — Account activation & deactivation
- `testAdminReportsAndCsvExport` — Analytical report summaries & CSV download

---

## 8. Sample REST API Endpoints

### Authentication
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane.doe@student.college.edu",
  "password": "Password@123",
  "role": "STUDENT"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@college.edu",
  "password": "Admin@123"
}
```

### Events
```http
GET /api/events?category=Technical&status=UPCOMING
GET /api/events/1
```

### Student Registrations
```http
POST /api/registrations
Content-Type: application/json

{ "eventId": 1 }
```

```http
DELETE /api/registrations/1
```

### Organizer Endpoints
```http
GET /api/organizer/events
GET /api/organizer/events/1/registrations
PATCH /api/organizer/registrations/1/attendance
Content-Type: application/json

{ "attendanceStatus": "PRESENT" }
```

### Administrator Endpoints
```http
GET /api/admin/dashboard
GET /api/admin/users
PATCH /api/admin/users/4/status
Content-Type: application/json

{ "active": false }
```

```http
GET /api/admin/reports
GET /api/admin/reports/csv
```

---

## 9. Common Errors & Troubleshooting

1. **Port 8080 already in use:**
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
   ```
   Or set a custom port in `application.properties`: `server.port=8081`.

2. **MySQL Access Denied / Connection Refused:**
   Ensure MySQL service is running. If MySQL is not installed locally, launch using the H2 profile:
   ```powershell
   .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
   ```

3. **CORS / Cross-Origin requests:**
   The backend includes comprehensive CORS configuration permitting requests from local origins (`localhost`, `127.0.0.1`, `file://`) with credentials enabled.
