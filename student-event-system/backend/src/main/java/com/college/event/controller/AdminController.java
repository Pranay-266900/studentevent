package com.college.event.controller;

import com.college.event.dto.*;
import com.college.event.entity.AttendanceStatus;
import com.college.event.entity.RegistrationStatus;
import com.college.event.entity.Role;
import com.college.event.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search) {
        List<UserResponse> users = adminService.getAllUsers(role, search);
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest req,
            Authentication auth) {
        UserResponse updated = adminService.updateUserStatus(id, req, auth);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateRequest req,
            Authentication auth) {
        UserResponse updated = adminService.updateUserRole(id, req, auth);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/registrations")
    public ResponseEntity<List<RegistrationResponse>> getAllRegistrations(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) RegistrationStatus regStatus,
            @RequestParam(required = false) AttendanceStatus attStatus) {
        List<RegistrationResponse> list = adminService.getAllRegistrations(eventId, regStatus, attStatus);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/reports")
    public ResponseEntity<ReportResponse> getReports(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String status) {
        ReportResponse reports = adminService.generateReports(eventId, startDate, endDate, status);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/csv")
    public ResponseEntity<String> exportCsv(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String status) {
        String csvData = adminService.generateCsvReport(eventId, startDate, endDate, status);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"college_event_report_" + LocalDate.now() + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }
}
