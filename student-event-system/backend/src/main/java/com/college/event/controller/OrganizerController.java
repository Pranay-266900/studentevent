package com.college.event.controller;

import com.college.event.dto.AttendanceUpdateRequest;
import com.college.event.dto.DashboardStatsResponse;
import com.college.event.dto.EventResponse;
import com.college.event.dto.RegistrationResponse;
import com.college.event.service.AdminService;
import com.college.event.service.EventService;
import com.college.event.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer")
@PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
public class OrganizerController {

    private final EventService eventService;
    private final RegistrationService registrationService;
    private final AdminService adminService;

    public OrganizerController(EventService eventService,
                               RegistrationService registrationService,
                               AdminService adminService) {
        this.eventService = eventService;
        this.registrationService = registrationService;
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getOrganizerDashboard(Authentication auth) {
        DashboardStatsResponse stats = adminService.getOrganizerDashboardStats(auth);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getOrganizerEvents(Authentication auth) {
        List<EventResponse> events = eventService.getOrganizerEvents(auth);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/events/{id}/registrations")
    public ResponseEntity<List<RegistrationResponse>> getEventRegistrations(@PathVariable Long id, Authentication auth) {
        List<RegistrationResponse> list = registrationService.getEventRegistrations(id, auth);
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/registrations/{id}/attendance")
    public ResponseEntity<RegistrationResponse> updateAttendance(@PathVariable Long id,
                                                                 @Valid @RequestBody AttendanceUpdateRequest req,
                                                                 Authentication auth) {
        RegistrationResponse updated = registrationService.updateAttendance(id, req, auth);
        return ResponseEntity.ok(updated);
    }
}
