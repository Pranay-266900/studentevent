package com.college.event.dto;

import com.college.event.entity.AttendanceStatus;
import com.college.event.entity.Event;
import com.college.event.entity.EventStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String venue;
    private Integer capacity;
    private EventStatus status;
    private Long organizerId;
    private String organizerName;
    private String organizerEmail;
    private int registeredCount;
    private int availableSeats;
    private LocalDateTime createdAt;
    private boolean userRegistered;
    private Long userRegistrationId;
    private AttendanceStatus userAttendanceStatus;

    public EventResponse() {}

    public EventResponse(Event event, int activeRegistrationsCount) {
        if (event != null) {
            this.id = event.getId();
            this.title = event.getTitle();
            this.description = event.getDescription();
            this.category = event.getCategory();
            this.eventDate = event.getEventDate();
            this.startTime = event.getStartTime();
            this.endTime = event.getEndTime();
            this.venue = event.getVenue();
            this.capacity = event.getCapacity();
            this.status = event.getStatus();
            if (event.getOrganizer() != null) {
                this.organizerId = event.getOrganizer().getId();
                this.organizerName = event.getOrganizer().getFullName();
                this.organizerEmail = event.getOrganizer().getEmail();
            }
            this.registeredCount = activeRegistrationsCount;
            this.availableSeats = Math.max(0, event.getCapacity() - activeRegistrationsCount);
            this.createdAt = event.getCreatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public int getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(int registeredCount) {
        this.registeredCount = registeredCount;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isUserRegistered() {
        return userRegistered;
    }

    public void setUserRegistered(boolean userRegistered) {
        this.userRegistered = userRegistered;
    }

    public Long getUserRegistrationId() {
        return userRegistrationId;
    }

    public void setUserRegistrationId(Long userRegistrationId) {
        this.userRegistrationId = userRegistrationId;
    }

    public AttendanceStatus getUserAttendanceStatus() {
        return userAttendanceStatus;
    }

    public void setUserAttendanceStatus(AttendanceStatus userAttendanceStatus) {
        this.userAttendanceStatus = userAttendanceStatus;
    }
}
