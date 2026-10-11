package com.college.event.service;

import com.college.event.dto.EventRequest;
import com.college.event.dto.EventResponse;
import com.college.event.entity.*;
import com.college.event.exception.BadRequestException;
import com.college.event.exception.ResourceNotFoundException;
import com.college.event.exception.UnauthorizedException;
import com.college.event.repository.EventRepository;
import com.college.event.repository.RegistrationRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final AuthService authService;

    public EventService(EventRepository eventRepository,
                        RegistrationRepository registrationRepository,
                        AuthService authService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents(String search, String category, EventStatus status, LocalDate date, Authentication auth) {
        // Auto update past events status if needed
        List<Event> events = eventRepository.filterEvents(
                (search != null && !search.trim().isEmpty()) ? search.trim() : null,
                category,
                status,
                date
        );

        User currentUser = null;
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            try {
                currentUser = authService.getAuthenticatedUser(auth);
            } catch (Exception ignored) {}
        }

        final User studentUser = currentUser;
        return events.stream().map(e -> toEventResponse(e, studentUser)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id, Authentication auth) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        User currentUser = null;
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            try {
                currentUser = authService.getAuthenticatedUser(auth);
            } catch (Exception ignored) {}
        }

        return toEventResponse(event, currentUser);
    }

    @Transactional
    public EventResponse createEvent(EventRequest req, Authentication auth) {
        User organizer = authService.getAuthenticatedUser(auth);

        validateEventRequest(req);

        Event event = new Event(
                req.getTitle().trim(),
                req.getDescription().trim(),
                req.getCategory().trim(),
                req.getEventDate(),
                req.getStartTime(),
                req.getEndTime(),
                req.getVenue().trim(),
                req.getCapacity(),
                req.getStatus() != null ? req.getStatus() : EventStatus.UPCOMING,
                organizer
        );

        // Calculate initial status if date is past
        updateStatusBasedOnTime(event);

        event = eventRepository.save(event);
        return toEventResponse(event, organizer);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest req, Authentication auth) {
        User user = authService.getAuthenticatedUser(auth);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        // Authorization check: Only event organizer or admin can update
        if (user.getRole() != Role.ADMIN && !event.getOrganizer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to modify this event.");
        }

        validateEventRequest(req);

        // Check if reducing capacity below current active registrations
        int activeCount = (int) registrationRepository.countByEventIdAndRegistrationStatus(id, RegistrationStatus.REGISTERED);
        if (req.getCapacity() < activeCount) {
            throw new BadRequestException("Capacity cannot be reduced below the current registered attendees count (" + activeCount + ").");
        }

        event.setTitle(req.getTitle().trim());
        event.setDescription(req.getDescription().trim());
        event.setCategory(req.getCategory().trim());
        event.setEventDate(req.getEventDate());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setVenue(req.getVenue().trim());
        event.setCapacity(req.getCapacity());
        if (req.getStatus() != null) {
            event.setStatus(req.getStatus());
        }

        updateStatusBasedOnTime(event);

        event = eventRepository.save(event);
        return toEventResponse(event, user);
    }

    @Transactional
    public void deleteEvent(Long id, Authentication auth) {
        User user = authService.getAuthenticatedUser(auth);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (user.getRole() != Role.ADMIN && !event.getOrganizer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this event.");
        }

        long activeRegistrations = registrationRepository.countByEventIdAndRegistrationStatus(id, RegistrationStatus.REGISTERED);
        if (activeRegistrations > 0) {
            // Cannot delete event with active attendees; set status to CANCELLED instead
            event.setStatus(EventStatus.CANCELLED);
            eventRepository.save(event);
            return;
        }

        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getOrganizerEvents(Authentication auth) {
        User organizer = authService.getAuthenticatedUser(auth);
        List<Event> events = eventRepository.findByOrganizerIdOrderByEventDateAscStartTimeAsc(organizer.getId());
        return events.stream().map(e -> toEventResponse(e, organizer)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return eventRepository.findDistinctCategories();
    }

    public EventResponse toEventResponse(Event event, User currentUser) {
        int activeCount = (int) registrationRepository.countByEventIdAndRegistrationStatus(event.getId(), RegistrationStatus.REGISTERED);
        EventResponse resp = new EventResponse(event, activeCount);

        if (currentUser != null && currentUser.getRole() == Role.STUDENT) {
            Optional<Registration> userReg = registrationRepository.findByStudentIdAndEventId(currentUser.getId(), event.getId());
            if (userReg.isPresent() && userReg.get().getRegistrationStatus() == RegistrationStatus.REGISTERED) {
                resp.setUserRegistered(true);
                resp.setUserRegistrationId(userReg.get().getId());
                resp.setUserAttendanceStatus(userReg.get().getAttendanceStatus());
            } else {
                resp.setUserRegistered(false);
            }
        }
        return resp;
    }

    private void validateEventRequest(EventRequest req) {
        if (req.getStartTime().isAfter(req.getEndTime()) || req.getStartTime().equals(req.getEndTime())) {
            throw new BadRequestException("Event start time must be before end time.");
        }
        if (req.getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Event date cannot be in the past.");
        }
    }

    private void updateStatusBasedOnTime(Event event) {
        if (event.getStatus() == EventStatus.CANCELLED) {
            return;
        }
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (event.getEventDate().isBefore(today)) {
            event.setStatus(EventStatus.COMPLETED);
        } else if (event.getEventDate().isEqual(today)) {
            if (now.isAfter(event.getEndTime())) {
                event.setStatus(EventStatus.COMPLETED);
            } else if (now.isAfter(event.getStartTime())) {
                event.setStatus(EventStatus.ONGOING);
            } else {
                event.setStatus(EventStatus.UPCOMING);
            }
        } else {
            event.setStatus(EventStatus.UPCOMING);
        }
    }
}
