package com.college.event.controller;

import com.college.event.dto.EventRequest;
import com.college.event.dto.EventResponse;
import com.college.event.entity.EventStatus;
import com.college.event.service.EventService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication auth) {
        List<EventResponse> events = eventService.getAllEvents(search, category, status, date, auth);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(eventService.getCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id, Authentication auth) {
        EventResponse event = eventService.getEventById(id, auth);
        return ResponseEntity.ok(event);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest req, Authentication auth) {
        EventResponse event = eventService.createEvent(req, auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long id,
                                                     @Valid @RequestBody EventRequest req,
                                                     Authentication auth) {
        EventResponse event = eventService.updateEvent(id, req, auth);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id, Authentication auth) {
        eventService.deleteEvent(id, auth);
        return ResponseEntity.ok(Map.of("message", "Event deleted or marked as cancelled successfully."));
    }
}
