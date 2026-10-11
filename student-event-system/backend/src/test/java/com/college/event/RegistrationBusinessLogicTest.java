package com.college.event;

import com.college.event.entity.*;
import com.college.event.repository.EventRepository;
import com.college.event.repository.RegistrationRepository;
import com.college.event.repository.UserRepository;
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

import java.time.LocalDate;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class RegistrationBusinessLogicTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    @WithMockUser(username = "jessica.lee@student.college.edu", roles = {"STUDENT"})
    public void testStudentRegisterSuccess() throws Exception {
        // Event 2 is "Annual Cultural Fest - Resonance"
        String regJson = """
            {
                "eventId": 2
            }
            """;

        mockMvc.perform(post("/api/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(regJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.registrationStatus").value("REGISTERED"))
                .andExpect(jsonPath("$.attendanceStatus").value("PENDING"));
    }

    @Test
    @WithMockUser(username = "alex.rivera@student.college.edu", roles = {"STUDENT"})
    public void testDuplicateRegistrationFails() throws Exception {
        // Alex Rivera is already registered for Event 1
        String regJson = """
            {
                "eventId": 1
            }
            """;

        mockMvc.perform(post("/api/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(regJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Conflict"));
    }

    @Test
    @WithMockUser(username = "alex.rivera@student.college.edu", roles = {"STUDENT"})
    public void testPastEventRegistrationFails() throws Exception {
        // Event 5 is past event
        String regJson = """
            {
                "eventId": 5
            }
            """;

        mockMvc.perform(post("/api/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(regJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    @WithMockUser(username = "sarah.jenkins@college.edu", roles = {"ORGANIZER"})
    public void testCapacityRestrictionEnforcement() throws Exception {
        // 1. Create an event with capacity = 1
        User organizer = userRepository.findByEmail("sarah.jenkins@college.edu").orElseThrow();
        Event miniEvent = new Event(
                "Limited Seat Workshop",
                "Strict capacity 1 event.",
                "Workshop",
                LocalDate.now().plusDays(20),
                LocalTime.of(14, 0),
                LocalTime.of(16, 0),
                "Conference Room 101",
                1,
                EventStatus.UPCOMING,
                organizer
        );
        miniEvent = eventRepository.save(miniEvent);
        Long eventId = miniEvent.getId();

        // 2. Student 1 (Alex) registers -> Should succeed
        User student1 = userRepository.findByEmail("alex.rivera@student.college.edu").orElseThrow();
        Registration reg1 = new Registration(student1, miniEvent);
        registrationRepository.save(reg1);

        // 3. Student 2 (Emily) attempts to register -> Should fail because capacity is full
        String regJson = "{\"eventId\":" + eventId + "}";
        mockMvc.perform(post("/api/registrations")
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("emily.watson@student.college.edu").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(regJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("capacity reached")));
    }

    @Test
    @WithMockUser(username = "sarah.jenkins@college.edu", roles = {"ORGANIZER"})
    public void testMarkAttendanceForRegisteredStudent() throws Exception {
        // Registration 1 is for Sarah's event (Hackathon)
        String attJson = """
            {
                "attendanceStatus": "PRESENT"
            }
            """;

        mockMvc.perform(patch("/api/organizer/registrations/1/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(attJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attendanceStatus").value("PRESENT"));
    }
}
