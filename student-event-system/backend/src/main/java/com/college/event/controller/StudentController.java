package com.college.event.controller;

import com.college.event.dto.DashboardStatsResponse;
import com.college.event.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentController {

    private final AdminService adminService;

    public StudentController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getStudentDashboard(Authentication auth) {
        DashboardStatsResponse stats = adminService.getStudentDashboardStats(auth);
        return ResponseEntity.ok(stats);
    }
}
