package com.college.event.dto;

import jakarta.validation.constraints.NotNull;

public class RegistrationRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    public RegistrationRequest() {}

    public RegistrationRequest(Long eventId) {
        this.eventId = eventId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
