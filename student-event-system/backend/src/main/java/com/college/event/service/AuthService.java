package com.college.event.service;

import com.college.event.dto.AuthResponse;
import com.college.event.dto.LoginRequest;
import com.college.event.dto.RegisterRequest;
import com.college.event.dto.UpdateProfileRequest;
import com.college.event.dto.UserResponse;
import com.college.event.entity.Role;
import com.college.event.entity.User;
import com.college.event.exception.BadRequestException;
import com.college.event.exception.ConflictException;
import com.college.event.exception.ResourceNotFoundException;
import com.college.event.exception.UnauthorizedException;
import com.college.event.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req, HttpServletRequest httpReq) {
        String cleanEmail = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new ConflictException("An account with email " + cleanEmail + " already exists.");
        }

        Role requestedRole = req.getRole();
        if (requestedRole == null) {
            requestedRole = Role.STUDENT;
        } else if (requestedRole == Role.ADMIN) {
            // Cannot register as admin through public registration
            throw new BadRequestException("Administrator registration is not permitted via public registration.");
        }

        User user = new User(
                req.getFullName().trim(),
                cleanEmail,
                passwordEncoder.encode(req.getPassword()),
                requestedRole
        );
        user = userRepository.save(user);

        // Auto authenticate on successful registration
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, req.getPassword())
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        HttpSession session = httpReq.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        return new AuthResponse(session.getId(), new UserResponse(user), "Registration successful");
    }

    public AuthResponse login(LoginRequest req, HttpServletRequest httpReq) {
        String cleanEmail = req.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact administrator.");
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(cleanEmail, req.getPassword())
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);

            HttpSession session = httpReq.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

            return new AuthResponse(session.getId(), new UserResponse(user), "Login successful");
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    public void logout(HttpServletRequest httpReq) {
        HttpSession session = httpReq.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    public User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("User is not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found in database"));
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest req, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        if (req.getFullName() != null && !req.getFullName().trim().isEmpty()) {
            user.setFullName(req.getFullName().trim());
        }

        if (req.getNewPassword() != null && !req.getNewPassword().trim().isEmpty()) {
            if (req.getCurrentPassword() == null || !passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
                throw new BadRequestException("Current password verification failed.");
            }
            user.setPasswordHash(passwordEncoder.encode(req.getNewPassword().trim()));
        }

        user = userRepository.save(user);
        return new UserResponse(user);
    }
}
