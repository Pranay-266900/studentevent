-- =====================================================================
-- Database Schema for Student Event Registration & Participation System
-- Database Name: student_event_system
-- =====================================================================

CREATE DATABASE IF NOT EXISTS student_event_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_event_system;

-- 1. Users Table
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Events Table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(150) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
    organizer_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_event_date (event_date),
    INDEX idx_event_status (status),
    INDEX idx_event_category (category),
    INDEX idx_event_organizer (organizer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Registrations Table
CREATE TABLE registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    registration_status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
    attendance_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_reg_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT,
    CONSTRAINT uk_student_event UNIQUE (student_id, event_id),
    INDEX idx_reg_student (student_id),
    INDEX idx_reg_event (event_id),
    INDEX idx_reg_status (registration_status),
    INDEX idx_reg_attendance (attendance_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
