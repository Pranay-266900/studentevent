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
public class AdminIntegrationTest {

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
    @WithMockUser(username = "admin@college.edu", roles = {"ADMIN"})
    public void testAdminCanAccessDashboard() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").isNumber())
                .andExpect(jsonPath("$.totalEvents").isNumber())
                .andExpect(jsonPath("$.totalRegistrations").isNumber());
    }

    @Test
    @WithMockUser(username = "alex.rivera@student.college.edu", roles = {"STUDENT"})
    public void testStudentForbiddenFromAdminDashboard() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@college.edu", roles = {"ADMIN"})
    public void testAdminCanListAndToggleUserStatus() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // Deactivate user 4 (Alex Rivera)
        String statusJson = """
            {
                "active": false
            }
            """;

        mockMvc.perform(patch("/api/admin/users/4/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(statusJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));

        // Reactivate user 4
        String reactivateJson = """
            {
                "active": true
            }
            """;

        mockMvc.perform(patch("/api/admin/users/4/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reactivateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockUser(username = "admin@college.edu", roles = {"ADMIN"})
    public void testAdminReportsAndCsvExport() throws Exception {
        // Test reports endpoint
        mockMvc.perform(get("/api/admin/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventSummaries").isArray())
                .andExpect(jsonPath("$.studentSummaries").isArray());

        // Test CSV download
        mockMvc.perform(get("/api/admin/reports/csv"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("text/csv"))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Registration ID,Student Name,Student Email")));
    }
}
