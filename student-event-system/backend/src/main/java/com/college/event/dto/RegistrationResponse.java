package com.college.event.dto;

import com.college.event.entity.AttendanceStatus;
import com.college.event.entity.Registration;
import com.college.event.entity.RegistrationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class RegistrationResponse {

    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long eventId;
    private String eventTitle;
    private String eventDescription;
    private String eventCategory;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String venue;
    private String organizerName;
    private LocalDateTime registrationDate;
    private RegistrationStatus registrationStatus;
    private AttendanceStatus attendanceStatus;

    public RegistrationResponse() {}

    public RegistrationResponse(Registration reg) {
        if (reg != null) {
            this.id = reg.getId();
            if (reg.getStudent() != null) {
                this.studentId = reg.getStudent().getId();
                this.studentName = reg.getStudent().getFullName();
                this.studentEmail = reg.getStudent().getEmail();
            }
            if (reg.getEvent() != null) {
                this.eventId = reg.getEvent().getId();
                this.eventTitle = reg.getEvent().getTitle();
                this.eventDescription = reg.getEvent().getDescription();
                this.eventCategory = reg.getEvent().getCategory();
                this.eventDate = reg.getEvent().getEventDate();
                this.startTime = reg.getEvent().getStartTime();
                this.endTime = reg.getEvent().getEndTime();
                this.venue = reg.getEvent().getVenue();
                if (reg.getEvent().getOrganizer() != null) {
                    this.organizerName = reg.getEvent().getOrganizer().getFullName();
                }
            }
            this.registrationDate = reg.getRegistrationDate();
            this.registrationStatus = reg.getRegistrationStatus();
            this.attendanceStatus = reg.getAttendanceStatus();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public String getEventCategory() {
        return eventCategory;
    }

    public void setEventCategory(String eventCategory) {
        this.eventCategory = eventCategory;
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

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
}
