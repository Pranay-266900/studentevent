package com.college.event;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class EventIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    public void testPublicCanViewEvents() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").isNotEmpty());
    }

    @Test
    public void testFilterEventsByCategory() throws Exception {
        mockMvc.perform(get("/api/events?category=Technical"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Technical"));
    }

    @Test
    @WithMockUser(username = "sarah.jenkins@college.edu", roles = {"ORGANIZER"})
    public void testOrganizerCanCreateEvent() throws Exception {
        String eventJson = """
            {
                "title": "Spring Code Fest 2026",
                "description": "Annual coding marathon with competitive algorithms.",
                "category": "Technical",
                "eventDate": "2026-11-28",
                "startTime": "10:00:00",
                "endTime": "16:00:00",
                "venue": "Computer Science Lab 4",
                "capacity": 50,
                "status": "UPCOMING"
            }
            """;

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Spring Code Fest 2026"))
                .andExpect(jsonPath("$.availableSeats").value(50));
    }

    @Test
    @WithMockUser(username = "alex.rivera@student.college.edu", roles = {"STUDENT"})
    public void testStudentCannotCreateEvent() throws Exception {
        String eventJson = """
            {
                "title": "Unauthorized Event",
                "description": "Should be rejected.",
                "category": "Cultural",
                "eventDate": "2026-12-01",
                "startTime": "10:00:00",
                "endTime": "12:00:00",
                "venue": "Auditorium",
                "capacity": 20
            }
            """;

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventJson))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "sarah.jenkins@college.edu", roles = {"ORGANIZER"})
    public void testEventInvalidTimesFails() throws Exception {
        // Start time after end time
        String invalidJson = """
            {
                "title": "Invalid Timing Event",
                "description": "Invalid time window.",
                "category": "Workshop",
                "eventDate": "2026-11-28",
                "startTime": "18:00:00",
                "endTime": "10:00:00",
                "venue": "Lab 1",
                "capacity": 20
            }
            """;

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }
}
