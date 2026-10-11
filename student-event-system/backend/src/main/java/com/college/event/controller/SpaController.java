package com.college.event.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Forward non-API, non-static file routes to index.html for React Router client-side routing
    @RequestMapping(value = {
        "/login",
        "/register",
        "/register-organizer",
        "/events",
        "/events/**",
        "/student-dashboard",
        "/my-registrations",
        "/organizer-dashboard",
        "/organizer-event-form",
        "/organizer-participants",
        "/admin-dashboard",
        "/admin-users",
        "/admin-events",
        "/admin-reports",
        "/profile",
        "/access-denied"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
