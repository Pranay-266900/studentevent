package com.college.event.dto;

public class AuthResponse {

    private String sessionId;
    private UserResponse user;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String sessionId, UserResponse user, String message) {
        this.sessionId = sessionId;
        this.user = user;
        this.message = message;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
