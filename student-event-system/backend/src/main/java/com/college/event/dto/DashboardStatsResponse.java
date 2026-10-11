package com.college.event.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    // Common / Admin counts
    private long totalUsers;
    private long totalStudents;
    private long totalOrganizers;
    private long totalAdmins;
    private long totalEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long cancelledEvents;
    private long totalRegistrations;
    private long activeRegistrations;
    private long cancelledRegistrations;
    private long attendancePresent;
    private long attendanceAbsent;
    private long attendancePending;
    private double attendanceRate;

    // Student specific
    private long myTotalRegistrations;
    private long myUpcomingRegistrations;
    private long myAttendedCount;
    private long myAbsentCount;

    // Organizer specific
    private long organizerEventsCount;
    private long organizerTotalRegistrations;
    private long organizerAvailableSeats;

    // Recent items
    private List<RegistrationResponse> recentRegistrations;
    private List<EventResponse> upcomingEventsList;
    private Map<String, Long> categoryBreakdown;

    public DashboardStatsResponse() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalOrganizers() {
        return totalOrganizers;
    }

    public void setTotalOrganizers(long totalOrganizers) {
        this.totalOrganizers = totalOrganizers;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public long getCompletedEvents() {
        return completedEvents;
    }

    public void setCompletedEvents(long completedEvents) {
        this.completedEvents = completedEvents;
    }

    public long getCancelledEvents() {
        return cancelledEvents;
    }

    public void setCancelledEvents(long cancelledEvents) {
        this.cancelledEvents = cancelledEvents;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getActiveRegistrations() {
        return activeRegistrations;
    }

    public void setActiveRegistrations(long activeRegistrations) {
        this.activeRegistrations = activeRegistrations;
    }

    public long getCancelledRegistrations() {
        return cancelledRegistrations;
    }

    public void setCancelledRegistrations(long cancelledRegistrations) {
        this.cancelledRegistrations = cancelledRegistrations;
    }

    public long getAttendancePresent() {
        return attendancePresent;
    }

    public void setAttendancePresent(long attendancePresent) {
        this.attendancePresent = attendancePresent;
    }

    public long getAttendanceAbsent() {
        return attendanceAbsent;
    }

    public void setAttendanceAbsent(long attendanceAbsent) {
        this.attendanceAbsent = attendanceAbsent;
    }

    public long getAttendancePending() {
        return attendancePending;
    }

    public void setAttendancePending(long attendancePending) {
        this.attendancePending = attendancePending;
    }

    public double getAttendanceRate() {
        return attendanceRate;
    }

    public void setAttendanceRate(double attendanceRate) {
        this.attendanceRate = attendanceRate;
    }

    public long getMyTotalRegistrations() {
        return myTotalRegistrations;
    }

    public void setMyTotalRegistrations(long myTotalRegistrations) {
        this.myTotalRegistrations = myTotalRegistrations;
    }

    public long getMyUpcomingRegistrations() {
        return myUpcomingRegistrations;
    }

    public void setMyUpcomingRegistrations(long myUpcomingRegistrations) {
        this.myUpcomingRegistrations = myUpcomingRegistrations;
    }

    public long getMyAttendedCount() {
        return myAttendedCount;
    }

    public void setMyAttendedCount(long myAttendedCount) {
        this.myAttendedCount = myAttendedCount;
    }

    public long getMyAbsentCount() {
        return myAbsentCount;
    }

    public void setMyAbsentCount(long myAbsentCount) {
        this.myAbsentCount = myAbsentCount;
    }

    public long getOrganizerEventsCount() {
        return organizerEventsCount;
    }

    public void setOrganizerEventsCount(long organizerEventsCount) {
        this.organizerEventsCount = organizerEventsCount;
    }

    public long getOrganizerTotalRegistrations() {
        return organizerTotalRegistrations;
    }

    public void setOrganizerTotalRegistrations(long organizerTotalRegistrations) {
        this.organizerTotalRegistrations = organizerTotalRegistrations;
    }

    public long getOrganizerAvailableSeats() {
        return organizerAvailableSeats;
    }

    public void setOrganizerAvailableSeats(long organizerAvailableSeats) {
        this.organizerAvailableSeats = organizerAvailableSeats;
    }

    public List<RegistrationResponse> getRecentRegistrations() {
        return recentRegistrations;
    }

    public void setRecentRegistrations(List<RegistrationResponse> recentRegistrations) {
        this.recentRegistrations = recentRegistrations;
    }

    public List<EventResponse> getUpcomingEventsList() {
        return upcomingEventsList;
    }

    public void setUpcomingEventsList(List<EventResponse> upcomingEventsList) {
        this.upcomingEventsList = upcomingEventsList;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
