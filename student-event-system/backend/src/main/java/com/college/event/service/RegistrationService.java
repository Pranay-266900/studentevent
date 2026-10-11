package com.college.event.service;

import com.college.event.dto.AttendanceUpdateRequest;
import com.college.event.dto.RegistrationRequest;
import com.college.event.dto.RegistrationResponse;
import com.college.event.entity.*;
import com.college.event.exception.BadRequestException;
import com.college.event.exception.ConflictException;
import com.college.event.exception.ResourceNotFoundException;
import com.college.event.exception.UnauthorizedException;
import com.college.event.repository.EventRepository;
import com.college.event.repository.RegistrationRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final AuthService authService;

    // Concurrency lock monitor for event capacity synchronization
    private final Object capacityLock = new Object();

    public RegistrationService(RegistrationRepository registrationRepository,
                               EventRepository eventRepository,
                               AuthService authService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.authService = authService;
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public RegistrationResponse registerStudent(RegistrationRequest req, Authentication auth) {
        User student = authService.getAuthenticatedUser(auth);
        if (student.getRole() != Role.STUDENT && student.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only students can register for events.");
        }

        Event event = eventRepository.findById(req.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + req.getEventId()));

        // Business Rule: Students cannot register for past events
        if (event.getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot register for an event that has already occurred.");
        }

        // Business Rule: Cannot register for cancelled events
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Registration is closed: This event has been cancelled.");
        }

        synchronized (capacityLock) {
            // Business Rule: Cannot register twice for the same event
            Optional<Registration> existingReg = registrationRepository.findByStudentIdAndEventId(student.getId(), event.getId());
            if (existingReg.isPresent() && existingReg.get().getRegistrationStatus() == RegistrationStatus.REGISTERED) {
                throw new ConflictException("You are already registered for this event.");
            }

            // Business Rule: Reject registrations when capacity is reached
            long activeRegistrations = registrationRepository.countByEventIdAndRegistrationStatus(event.getId(), RegistrationStatus.REGISTERED);
            if (activeRegistrations >= event.getCapacity()) {
                throw new BadRequestException("Event capacity reached (" + event.getCapacity() + " seats full). No seats remaining.");
            }

            Registration registration;
            if (existingReg.isPresent()) {
                // Re-register previously cancelled registration
                registration = existingReg.get();
                registration.setRegistrationStatus(RegistrationStatus.REGISTERED);
                registration.setAttendanceStatus(AttendanceStatus.PENDING);
                registration.setRegistrationDate(LocalDateTime.now());
            } else {
                registration = new Registration(student, event);
            }

            registration = registrationRepository.save(registration);
            return new RegistrationResponse(registration);
        }
    }

    @Transactional
    public RegistrationResponse cancelRegistration(Long registrationId, Authentication auth) {
        User user = authService.getAuthenticatedUser(auth);
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        // Authorization check: Only the registered student or Admin can cancel
        if (user.getRole() != Role.ADMIN && !registration.getStudent().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to cancel this registration.");
        }

        if (registration.getRegistrationStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("Registration is already cancelled.");
        }

        // Check if event has already passed
        if (registration.getEvent().getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot cancel registration for an event that has already passed.");
        }

        registration.setRegistrationStatus(RegistrationStatus.CANCELLED);
        registration = registrationRepository.save(registration);
        return new RegistrationResponse(registration);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getStudentRegistrations(Authentication auth) {
        User student = authService.getAuthenticatedUser(auth);
        List<Registration> list = registrationRepository.findByStudentIdOrderByRegistrationDateDesc(student.getId());
        return list.stream().map(RegistrationResponse::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getEventRegistrations(Long eventId, Authentication auth) {
        User user = authService.getAuthenticatedUser(auth);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        if (user.getRole() != Role.ADMIN && !event.getOrganizer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view participants for this event.");
        }

        List<Registration> list = registrationRepository.findByEventIdOrderByRegistrationDateAsc(eventId);
        return list.stream().map(RegistrationResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public RegistrationResponse updateAttendance(Long registrationId, AttendanceUpdateRequest req, Authentication auth) {
        User user = authService.getAuthenticatedUser(auth);
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        // Check authorization: Organizer of event or Admin
        if (user.getRole() != Role.ADMIN && !registration.getEvent().getOrganizer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to mark attendance for this event.");
        }

        // Business Rule: Attendance can be marked only for registered students
        if (registration.getRegistrationStatus() != RegistrationStatus.REGISTERED) {
            throw new BadRequestException("Attendance cannot be marked for cancelled registrations.");
        }

        registration.setAttendanceStatus(req.getAttendanceStatus());
        registration = registrationRepository.save(registration);
        return new RegistrationResponse(registration);
    }
}
