-- =====================================================================
-- Sample Data for Student Event Registration & Participation System
-- Database Name: student_event_system
-- =====================================================================

USE student_event_system;

-- Clear previous data
DELETE FROM registrations;
DELETE FROM events;
DELETE FROM users;

-- 1. Insert Users
-- Passwords:
-- Admin: Admin@123 -> $2a$10$2nIT7LJA3v7AZZE1cgA7zubG9Ger/1hT8U7tw4N8PlNKBuHs8DgF6
-- Others: Password@123 -> $2a$10$Zt5vY.DSqPKnm4EzW6H.KegPDklp1D7jSuoPe.5xhAnS/qwIfE.vm
INSERT INTO users (id, full_name, email, password_hash, role, active, created_at) VALUES
(1, 'System Administrator', 'admin@college.edu', '$2a$10$2nIT7LJA3v7AZZE1cgA7zubG9Ger/1hT8U7tw4N8PlNKBuHs8DgF6', 'ADMIN', TRUE, NOW()),
(2, 'Dr. Sarah Jenkins', 'sarah.jenkins@college.edu', '$2a$10$Zt5vY.DSqPKnm4EzW6H.KegPDklp1D7jSuoPe.5xhAnS/qwIfE.vm', 'ORGANIZER', TRUE, NOW()),
(3, 'Prof. Michael Chang', 'michael.chang@college.edu', '$2a$10$Zt5vY.DSqPKnm4EzW6H.KegPDklp1D7jSuoPe.5xhAnS/qwIfE.vm', 'ORGANIZER', TRUE, NOW()),
(4, 'Alex Rivera', 'alex.rivera@student.college.edu', '$2a$10$Zt5vY.DSqPKnm4EzW6H.KegPDklp1D7jSuoPe.5xhAnS/qwIfE.vm', 'STUDENT', TRUE, NOW()),
(5, 'Emily Watson', 'emily.watson@student.college.edu', '$2a$10$Zt5vY.DSqPKnm4EzW6H.KegPDklp1D7jSuoPe.5xhAnS/qwIfE.vm', 'STUDENT', TRUE, NOW()),
(6, 'Rahul Sharma', 'rahul.sharma@student.college.edu', '$2a$10$Zt5vY.DSqPKnm4EzW6H.KegPDklp1D7jSuoPe.5xhAnS/qwIfE.vm', 'STUDENT', TRUE, NOW()),
(7, 'Jessica Lee', 'jessica.lee@student.college.edu', '$2a$10$Zt5vY.DSqPKnm4EzW6H.KegPDklp1D7jSuoPe.5xhAnS/qwIfE.vm', 'STUDENT', TRUE, NOW());

-- 2. Insert Events
INSERT INTO events (id, title, description, category, event_date, start_time, end_time, venue, capacity, status, organizer_id, created_at) VALUES
(1, 'National Hackathon 2026', 'A 24-hour innovation marathon bringing together students across departments to build cutting-edge software solutions.', 'Technical', '2026-11-15', '09:00:00', '18:00:00', 'Innovation Hall & CS Labs', 60, 'UPCOMING', 2, NOW()),
(2, 'Annual Cultural Fest - Resonance', 'The flagship cultural celebration featuring music concerts, dance competitions, drama, and fine arts exhibits.', 'Cultural', '2026-11-20', '10:00:00', '21:00:00', 'College Main Auditorium', 150, 'UPCOMING', 2, NOW()),
(3, 'AI & Robotics Hands-on Workshop', 'An intensive practical workshop exploring computer vision, reinforcement learning, and ROS-based robotics simulation.', 'Workshop', '2026-10-25', '14:00:00', '17:30:00', 'Robotics Lab 3', 30, 'UPCOMING', 3, NOW()),
(4, 'Inter-College Basketball Championship', 'Competitive 5v5 basketball tournament between top collegiate teams with trophies and certificates.', 'Sports', '2026-10-30', '08:30:00', '16:00:00', 'Indoor Sports Complex', 40, 'UPCOMING', 3, NOW()),
(5, 'Cloud Computing & DevOps Symposium', 'Industry keynote lectures and student paper presentations on cloud native architecture and Kubernetes.', 'Seminar', '2026-10-05', '10:00:00', '15:00:00', 'Seminar Hall B', 50, 'COMPLETED', 2, NOW());

-- 3. Insert Registrations
INSERT INTO registrations (id, student_id, event_id, registration_date, registration_status, attendance_status) VALUES
-- Alex Rivera registered for Hackathon, Cultural Fest, and Completed Cloud Symposium
(1, 4, 1, '2026-10-06 10:15:00', 'REGISTERED', 'PENDING'),
(2, 4, 2, '2026-10-06 10:30:00', 'REGISTERED', 'PENDING'),
(3, 4, 5, '2026-10-02 09:00:00', 'REGISTERED', 'PRESENT'),

-- Emily Watson registered for Hackathon and AI Workshop
(4, 5, 1, '2026-10-07 11:20:00', 'REGISTERED', 'PENDING'),
(5, 5, 3, '2026-10-07 11:45:00', 'REGISTERED', 'PENDING'),
(6, 5, 5, '2026-10-02 14:10:00', 'REGISTERED', 'ABSENT'),

-- Rahul Sharma registered for Basketball Championship and AI Workshop
(7, 6, 4, '2026-10-08 16:00:00', 'REGISTERED', 'PENDING'),
(8, 6, 3, '2026-10-08 16:30:00', 'REGISTERED', 'PENDING'),

-- Jessica Lee registered and then cancelled Hackathon
(9, 7, 1, '2026-10-09 13:00:00', 'CANCELLED', 'PENDING');
