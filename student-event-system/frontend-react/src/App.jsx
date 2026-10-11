import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OrganizerRegister } from './pages/OrganizerRegister';
import { Events } from './pages/Events';
import { Profile } from './pages/Profile';
import { StudentDashboard } from './pages/StudentDashboard';
import { MyRegistrations } from './pages/MyRegistrations';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { OrganizerEventForm } from './pages/OrganizerEventForm';
import { OrganizerParticipants } from './pages/OrganizerParticipants';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminEvents } from './pages/AdminEvents';
import { AdminReports } from './pages/AdminReports';
import { AccessDenied } from './pages/AccessDenied';
import { NotFound } from './pages/NotFound';

export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-organizer" element={<OrganizerRegister />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Authenticated User Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />

          {/* Organizer Routes */}
          <Route
            path="/organizer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer-event-form"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                <OrganizerEventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer-participants"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                <OrganizerParticipants />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-events"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
