package com.college.event.controller;

import com.college.event.dto.RegistrationRequest;
import com.college.event.dto.RegistrationResponse;
import com.college.event.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<RegistrationResponse> registerStudent(@Valid @RequestBody RegistrationRequest req, Authentication auth) {
        RegistrationResponse response = registrationService.registerStudent(req, auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<RegistrationResponse>> getMyRegistrations(Authentication auth) {
        List<RegistrationResponse> list = registrationService.getStudentRegistrations(auth);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> cancelRegistration(@PathVariable Long id, Authentication auth) {
        RegistrationResponse updated = registrationService.cancelRegistration(id, auth);
        return ResponseEntity.ok(Map.of(
                "message", "Registration successfully cancelled.",
                "registration", updated
        ));
    }
}
