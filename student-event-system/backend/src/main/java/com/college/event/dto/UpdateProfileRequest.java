package com.college.event.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    private String currentPassword;

    @Size(min = 6, message = "New password must be at least 6 characters")
    private String newPassword;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String fullName, String currentPassword, String newPassword) {
        this.fullName = fullName;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
