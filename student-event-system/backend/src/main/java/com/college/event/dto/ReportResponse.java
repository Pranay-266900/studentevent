package com.college.event.dto;

import java.time.LocalDate;
import java.util.List;

public class ReportResponse {

    public static class EventRegistrationSummary {
        private Long eventId;
        private String title;
        private String category;
        private LocalDate eventDate;
        private int capacity;
        private long registeredCount;
        private long presentCount;
        private long absentCount;
        private long pendingCount;
        private double fillRate;
        private double attendanceRate;

        public EventRegistrationSummary() {}

        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public LocalDate getEventDate() { return eventDate; }
        public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
        public int getCapacity() { return capacity; }
        public void setCapacity(int capacity) { this.capacity = capacity; }
        public long getRegisteredCount() { return registeredCount; }
        public void setRegisteredCount(long registeredCount) { this.registeredCount = registeredCount; }
        public long getPresentCount() { return presentCount; }
        public void setPresentCount(long presentCount) { this.presentCount = presentCount; }
        public long getAbsentCount() { return absentCount; }
        public void setAbsentCount(long absentCount) { this.absentCount = absentCount; }
        public long getPendingCount() { return pendingCount; }
        public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }
        public double getFillRate() { return fillRate; }
        public void setFillRate(double fillRate) { this.fillRate = fillRate; }
        public double getAttendanceRate() { return attendanceRate; }
        public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }
    }

    public static class StudentParticipationSummary {
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private long totalRegistered;
        private long totalPresent;
        private long totalAbsent;
        private long totalCancelled;

        public StudentParticipationSummary() {}

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        public String getStudentEmail() { return studentEmail; }
        public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
        public long getTotalRegistered() { return totalRegistered; }
        public void setTotalRegistered(long totalRegistered) { this.totalRegistered = totalRegistered; }
        public long getTotalPresent() { return totalPresent; }
        public void setTotalPresent(long totalPresent) { this.totalPresent = totalPresent; }
        public long getTotalAbsent() { return totalAbsent; }
        public void setTotalAbsent(long totalAbsent) { this.totalAbsent = totalAbsent; }
        public long getTotalCancelled() { return totalCancelled; }
        public void setTotalCancelled(long totalCancelled) { this.totalCancelled = totalCancelled; }
    }

    public static class AttendanceSummary {
        private long totalPresent;
        private long totalAbsent;
        private long totalPending;
        private double attendanceRate;

        public AttendanceSummary() {}

        public long getTotalPresent() { return totalPresent; }
        public void setTotalPresent(long totalPresent) { this.totalPresent = totalPresent; }
        public long getTotalAbsent() { return totalAbsent; }
        public void setTotalAbsent(long totalAbsent) { this.totalAbsent = totalAbsent; }
        public long getTotalPending() { return totalPending; }
        public void setTotalPending(long totalPending) { this.totalPending = totalPending; }
        public double getAttendanceRate() { return attendanceRate; }
        public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }
    }

    public static class RegistrationStatusSummary {
        private long registered;
        private long cancelled;
        private long total;

        public RegistrationStatusSummary() {}

        public long getRegistered() { return registered; }
        public void setRegistered(long registered) { this.registered = registered; }
        public long getCancelled() { return cancelled; }
        public void setCancelled(long cancelled) { this.cancelled = cancelled; }
        public long getTotal() { return total; }
        public void setTotal(long total) { this.total = total; }
    }

    public static class DateWiseSummary {
        private LocalDate date;
        private int eventCount;
        private long totalRegistrations;

        public DateWiseSummary() {}

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public int getEventCount() { return eventCount; }
        public void setEventCount(int eventCount) { this.eventCount = eventCount; }
        public long getTotalRegistrations() { return totalRegistrations; }
        public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }
    }

    private List<EventRegistrationSummary> eventSummaries;
    private List<StudentParticipationSummary> studentSummaries;
    private AttendanceSummary attendanceSummary;
    private RegistrationStatusSummary statusSummary;
    private List<DateWiseSummary> dateWiseSummaries;

    public ReportResponse() {}

    public List<EventRegistrationSummary> getEventSummaries() { return eventSummaries; }
    public void setEventSummaries(List<EventRegistrationSummary> eventSummaries) { this.eventSummaries = eventSummaries; }

    public List<StudentParticipationSummary> getStudentSummaries() { return studentSummaries; }
    public void setStudentSummaries(List<StudentParticipationSummary> studentSummaries) { this.studentSummaries = studentSummaries; }

    public AttendanceSummary getAttendanceSummary() { return attendanceSummary; }
    public void setAttendanceSummary(AttendanceSummary attendanceSummary) { this.attendanceSummary = attendanceSummary; }

    public RegistrationStatusSummary getStatusSummary() { return statusSummary; }
    public void setStatusSummary(RegistrationStatusSummary summary) { this.statusSummary = summary; }

    public List<DateWiseSummary> getDateWiseSummaries() { return dateWiseSummaries; }
    public void setDateWiseSummaries(List<DateWiseSummary> dateWiseSummaries) { this.dateWiseSummaries = dateWiseSummaries; }
}
