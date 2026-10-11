package com.college.event.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return bcrypt.encode(rawPassword);
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                if (bcrypt.matches(rawPassword, encodedPassword)) {
                    return true;
                }
                String raw = rawPassword != null ? rawPassword.toString().trim() : "";
                // Support both Password@123 and role aliases (Admin@123, Organizer@123, Student@123) for demo accounts
                if ("Organizer@123".equalsIgnoreCase(raw) || "Student@123".equalsIgnoreCase(raw) ||
                    "Password@123".equalsIgnoreCase(raw) || "Admin@123".equalsIgnoreCase(raw)) {
                    return bcrypt.matches("Password@123", encodedPassword) || bcrypt.matches("Admin@123", encodedPassword);
                }
                return false;
            }
        };
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
                // Static resources & Frontend web pages & SPA client routes
                .requestMatchers(
                    "/", "/*.html", "/css/**", "/js/**", "/assets/**", "/images/**", "/favicon.ico",
                    "/login", "/register", "/register-organizer", "/events", "/events/**", "/student-dashboard", "/my-registrations",
                    "/organizer-dashboard", "/organizer-event-form", "/organizer-participants",
                    "/admin-dashboard", "/admin-users", "/admin-events", "/admin-reports", "/profile",
                    "/access-denied",
                    "/h2-console/**", "/error"
                ).permitAll()

                // Public Auth APIs
                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login",
                    "/api/auth/logout"
                ).permitAll()

                // Public Event APIs (Browsing & Categories)
                .requestMatchers(HttpMethod.GET, "/api/events", "/api/events/**").permitAll()

                // Profile and Current User API
                .requestMatchers("/api/auth/me", "/api/auth/profile").authenticated()

                // Student Registration endpoints
                .requestMatchers("/api/registrations/**").hasAnyRole("STUDENT", "ADMIN")

                // Event Modification endpoints (Creating/Editing/Deleting events)
                .requestMatchers(HttpMethod.POST, "/api/events").hasAnyRole("ORGANIZER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/events/**").hasAnyRole("ORGANIZER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasAnyRole("ORGANIZER", "ADMIN")

                // Organizer endpoints
                .requestMatchers("/api/organizer/**").hasAnyRole("ORGANIZER", "ADMIN")

                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    String json = String.format("{\"timestamp\":\"%s\",\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication required\",\"path\":\"%s\"}",
                            LocalDateTime.now(), request.getRequestURI());
                    response.getWriter().write(json);
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    String json = String.format("{\"timestamp\":\"%s\",\"status\":403,\"error\":\"Forbidden\",\"message\":\"Access denied\",\"path\":\"%s\"}",
                            LocalDateTime.now(), request.getRequestURI());
                    response.getWriter().write(json);
                })
            );

        // H2 console frame options
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Allow common local development origins and null origin (when opening static files directly in browser)
        config.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "http://localhost:3000",
            "http://localhost:5500",
            "http://localhost:8080",
            "null"
        ));
        config.setAllowedHeaders(Arrays.asList(
            "Authorization", "Cache-Control", "Content-Type", "Accept",
            "X-Requested-With", "X-Auth-Token", "Origin"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        config.setExposedHeaders(List.of("Content-Disposition", "Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
