package com.college.event.dto;

import com.college.event.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

public class AttendanceUpdateRequest {

    @NotNull(message = "Attendance status is required")
    private AttendanceStatus attendanceStatus;

    public AttendanceUpdateRequest() {}

    public AttendanceUpdateRequest(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
}
