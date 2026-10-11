package com.college.event.config;

import com.college.event.entity.*;
import com.college.event.repository.EventRepository;
import com.college.event.repository.RegistrationRepository;
import com.college.event.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.fullname:System Administrator}")
    private String adminFullName;

    @Value("${app.admin.email:admin@college.edu}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${app.data.seed-sample-data:true}")
    private boolean seedSampleData;

    public DataInitializer(UserRepository userRepository,
                           EventRepository eventRepository,
                           RegistrationRepository registrationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Ensure Admin User exists
        if (!userRepository.existsByEmail(adminEmail.toLowerCase().trim())) {
            User admin = new User(
                    adminFullName,
                    adminEmail.toLowerCase().trim(),
                    passwordEncoder.encode(adminPassword),
                    Role.ADMIN
            );
            userRepository.save(admin);
            log.info("Initialized default administrator account: {}", adminEmail);
        }

        // 2. Seed Sample Data if enabled and database has no events
        if (seedSampleData && eventRepository.count() == 0) {
            log.info("Seeding realistic sample data for testing and demonstration...");

            // Create Organizers
            User org1 = userRepository.findByEmail("sarah.jenkins@college.edu")
                    .orElseGet(() -> userRepository.save(new User("Dr. Sarah Jenkins", "sarah.jenkins@college.edu", passwordEncoder.encode("Password@123"), Role.ORGANIZER)));

            User org2 = userRepository.findByEmail("michael.chang@college.edu")
                    .orElseGet(() -> userRepository.save(new User("Prof. Michael Chang", "michael.chang@college.edu", passwordEncoder.encode("Password@123"), Role.ORGANIZER)));

            // Create Students
            User stu1 = userRepository.findByEmail("alex.rivera@student.college.edu")
                    .orElseGet(() -> userRepository.save(new User("Alex Rivera", "alex.rivera@student.college.edu", passwordEncoder.encode("Password@123"), Role.STUDENT)));

            User stu2 = userRepository.findByEmail("emily.watson@student.college.edu")
                    .orElseGet(() -> userRepository.save(new User("Emily Watson", "emily.watson@student.college.edu", passwordEncoder.encode("Password@123"), Role.STUDENT)));

            User stu3 = userRepository.findByEmail("rahul.sharma@student.college.edu")
                    .orElseGet(() -> userRepository.save(new User("Rahul Sharma", "rahul.sharma@student.college.edu", passwordEncoder.encode("Password@123"), Role.STUDENT)));

            User stu4 = userRepository.findByEmail("jessica.lee@student.college.edu")
                    .orElseGet(() -> userRepository.save(new User("Jessica Lee", "jessica.lee@student.college.edu", passwordEncoder.encode("Password@123"), Role.STUDENT)));

            // Create Events
            Event e1 = new Event(
                    "National Hackathon 2026",
                    "A 24-hour innovation marathon bringing together students across departments to build cutting-edge software solutions.",
                    "Technical",
                    LocalDate.now().plusDays(25),
                    LocalTime.of(9, 0),
                    LocalTime.of(18, 0),
                    "Innovation Hall & CS Labs",
                    60,
                    EventStatus.UPCOMING,
                    org1
            );
            eventRepository.save(e1);

            Event e2 = new Event(
                    "Annual Cultural Fest - Resonance",
                    "The flagship cultural celebration featuring music concerts, dance competitions, drama, and fine arts exhibits.",
                    "Cultural",
                    LocalDate.now().plusDays(35),
                    LocalTime.of(10, 0),
                    LocalTime.of(21, 0),
                    "College Main Auditorium",
                    150,
                    EventStatus.UPCOMING,
                    org1
            );
            eventRepository.save(e2);

            Event e3 = new Event(
                    "AI & Robotics Hands-on Workshop",
                    "An intensive practical workshop exploring computer vision, reinforcement learning, and ROS-based robotics simulation.",
                    "Workshop",
                    LocalDate.now().plusDays(10),
                    LocalTime.of(14, 0),
                    LocalTime.of(17, 30),
                    "Robotics Lab 3",
                    30,
                    EventStatus.UPCOMING,
                    org2
            );
            eventRepository.save(e3);

            Event e4 = new Event(
                    "Inter-College Basketball Championship",
                    "Competitive 5v5 basketball tournament between top collegiate teams with trophies and certificates.",
                    "Sports",
                    LocalDate.now().plusDays(15),
                    LocalTime.of(8, 30),
                    LocalTime.of(16, 0),
                    "Indoor Sports Complex",
                    40,
                    EventStatus.UPCOMING,
                    org2
            );
            eventRepository.save(e4);

            Event e5 = new Event(
                    "Cloud Computing & DevOps Symposium",
                    "Industry keynote lectures and student paper presentations on cloud native architecture and Kubernetes.",
                    "Seminar",
                    LocalDate.now().minusDays(5),
                    LocalTime.of(10, 0),
                    LocalTime.of(15, 0),
                    "Seminar Hall B",
                    50,
                    EventStatus.COMPLETED,
                    org1
            );
            eventRepository.save(e5);

            // Create Registrations
            Registration r1 = new Registration(stu1, e1);
            registrationRepository.save(r1);

            Registration r2 = new Registration(stu1, e2);
            registrationRepository.save(r2);

            Registration r3 = new Registration(stu1, e5);
            r3.setAttendanceStatus(AttendanceStatus.PRESENT);
            registrationRepository.save(r3);

            Registration r4 = new Registration(stu2, e1);
            registrationRepository.save(r4);

            Registration r5 = new Registration(stu2, e3);
            registrationRepository.save(r5);

            Registration r6 = new Registration(stu2, e5);
            r6.setAttendanceStatus(AttendanceStatus.ABSENT);
            registrationRepository.save(r6);

            Registration r7 = new Registration(stu3, e3);
            registrationRepository.save(r7);

            Registration r8 = new Registration(stu3, e4);
            registrationRepository.save(r8);

            Registration r9 = new Registration(stu4, e1);
            r9.setRegistrationStatus(RegistrationStatus.CANCELLED);
            registrationRepository.save(r9);

            log.info("Successfully seeded users, events, and registrations!");
        }
    }
}
