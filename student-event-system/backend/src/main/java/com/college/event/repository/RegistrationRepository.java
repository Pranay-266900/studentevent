package com.college.event.repository;

import com.college.event.entity.AttendanceStatus;
import com.college.event.entity.Registration;
import com.college.event.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentIdOrderByRegistrationDateDesc(Long studentId);

    List<Registration> findByEventIdOrderByRegistrationDateAsc(Long eventId);

    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);

    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);

    long countByEventIdAndRegistrationStatus(Long eventId, RegistrationStatus status);

    long countByStudentIdAndRegistrationStatus(Long studentId, RegistrationStatus status);

    long countByStudentIdAndAttendanceStatus(Long studentId, AttendanceStatus status);

    long countByEventIdAndAttendanceStatus(Long eventId, AttendanceStatus status);

    long countByRegistrationStatus(RegistrationStatus status);

    long countByAttendanceStatus(AttendanceStatus status);

    @Query("SELECT r FROM Registration r WHERE " +
           "r.event.organizer.id = :organizerId ORDER BY r.registrationDate DESC")
    List<Registration> findByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT r FROM Registration r WHERE " +
           "(:eventId IS NULL OR r.event.id = :eventId) AND " +
           "(:regStatus IS NULL OR r.registrationStatus = :regStatus) AND " +
           "(:attStatus IS NULL OR r.attendanceStatus = :attStatus) " +
           "ORDER BY r.registrationDate DESC")
    List<Registration> filterRegistrations(@Param("eventId") Long eventId,
                                           @Param("regStatus") RegistrationStatus regStatus,
                                           @Param("attStatus") AttendanceStatus attStatus);
}
