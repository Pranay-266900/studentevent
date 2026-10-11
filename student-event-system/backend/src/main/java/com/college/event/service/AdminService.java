package com.college.event.service;

import com.college.event.dto.*;
import com.college.event.entity.*;
import com.college.event.exception.BadRequestException;
import com.college.event.exception.ResourceNotFoundException;
import com.college.event.repository.EventRepository;
import com.college.event.repository.RegistrationRepository;
import com.college.event.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final AuthService authService;

    public AdminService(UserRepository userRepository,
                        EventRepository eventRepository,
                        RegistrationRepository registrationRepository,
                        AuthService authService) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getAdminDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        long users = userRepository.count();
        long students = userRepository.countByRole(Role.STUDENT);
        long organizers = userRepository.countByRole(Role.ORGANIZER);
        long admins = userRepository.countByRole(Role.ADMIN);

        long events = eventRepository.count();
        long upcoming = eventRepository.countByStatus(EventStatus.UPCOMING);
        long completed = eventRepository.countByStatus(EventStatus.COMPLETED);
        long cancelled = eventRepository.countByStatus(EventStatus.CANCELLED);

        long totalRegs = registrationRepository.count();
        long activeRegs = registrationRepository.countByRegistrationStatus(RegistrationStatus.REGISTERED);
        long cancelledRegs = registrationRepository.countByRegistrationStatus(RegistrationStatus.CANCELLED);

        long present = registrationRepository.countByAttendanceStatus(AttendanceStatus.PRESENT);
        long absent = registrationRepository.countByAttendanceStatus(AttendanceStatus.ABSENT);
        long pending = registrationRepository.countByAttendanceStatus(AttendanceStatus.PENDING);

        double attRate = (present + absent > 0) ? ((double) present / (present + absent)) * 100.0 : 0.0;

        stats.setTotalUsers(users);
        stats.setTotalStudents(students);
        stats.setTotalOrganizers(organizers);
        stats.setTotalAdmins(admins);

        stats.setTotalEvents(events);
        stats.setUpcomingEvents(upcoming);
        stats.setCompletedEvents(completed);
        stats.setCancelledEvents(cancelled);

        stats.setTotalRegistrations(totalRegs);
        stats.setActiveRegistrations(activeRegs);
        stats.setCancelledRegistrations(cancelledRegs);

        stats.setAttendancePresent(present);
        stats.setAttendanceAbsent(absent);
        stats.setAttendancePending(pending);
        stats.setAttendanceRate(Math.round(attRate * 10.0) / 10.0);

        // Recent 5 registrations
        List<Registration> allRegs = registrationRepository.findAll();
        allRegs.sort((a, b) -> b.getRegistrationDate().compareTo(a.getRegistrationDate()));
        stats.setRecentRegistrations(
                allRegs.stream().limit(6).map(RegistrationResponse::new).collect(Collectors.toList())
        );

        // Category breakdown
        Map<String, Long> catMap = new HashMap<>();
        for (Event e : eventRepository.findAll()) {
            catMap.put(e.getCategory(), catMap.getOrDefault(e.getCategory(), 0L) + 1);
        }
        stats.setCategoryBreakdown(catMap);

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getOrganizerDashboardStats(Authentication auth) {
        User organizer = authService.getAuthenticatedUser(auth);
        DashboardStatsResponse stats = new DashboardStatsResponse();

        List<Event> myEvents = eventRepository.findByOrganizerIdOrderByEventDateAscStartTimeAsc(organizer.getId());
        long totalEvents = myEvents.size();
        long totalRegistrations = 0;
        long totalAvailableSeats = 0;
        long present = 0;
        long absent = 0;
        long pending = 0;

        for (Event e : myEvents) {
            long active = registrationRepository.countByEventIdAndRegistrationStatus(e.getId(), RegistrationStatus.REGISTERED);
            totalRegistrations += active;
            totalAvailableSeats += Math.max(0, e.getCapacity() - active);
            present += registrationRepository.countByEventIdAndAttendanceStatus(e.getId(), AttendanceStatus.PRESENT);
            absent += registrationRepository.countByEventIdAndAttendanceStatus(e.getId(), AttendanceStatus.ABSENT);
            pending += registrationRepository.countByEventIdAndAttendanceStatus(e.getId(), AttendanceStatus.PENDING);
        }

        double rate = (present + absent > 0) ? ((double) present / (present + absent)) * 100.0 : 0.0;

        stats.setOrganizerEventsCount(totalEvents);
        stats.setOrganizerTotalRegistrations(totalRegistrations);
        stats.setOrganizerAvailableSeats(totalAvailableSeats);
        stats.setAttendancePresent(present);
        stats.setAttendanceAbsent(absent);
        stats.setAttendancePending(pending);
        stats.setAttendanceRate(Math.round(rate * 10.0) / 10.0);

        List<Registration> recent = registrationRepository.findByOrganizerId(organizer.getId());
        stats.setRecentRegistrations(
                recent.stream().limit(6).map(RegistrationResponse::new).collect(Collectors.toList())
        );

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStudentDashboardStats(Authentication auth) {
        User student = authService.getAuthenticatedUser(auth);
        DashboardStatsResponse stats = new DashboardStatsResponse();

        List<Registration> regs = registrationRepository.findByStudentIdOrderByRegistrationDateDesc(student.getId());

        long activeCount = regs.stream().filter(r -> r.getRegistrationStatus() == RegistrationStatus.REGISTERED).count();
        long upcomingCount = regs.stream()
                .filter(r -> r.getRegistrationStatus() == RegistrationStatus.REGISTERED &&
                             !r.getEvent().getEventDate().isBefore(LocalDate.now()))
                .count();

        long attended = regs.stream().filter(r -> r.getAttendanceStatus() == AttendanceStatus.PRESENT).count();
        long absent = regs.stream().filter(r -> r.getAttendanceStatus() == AttendanceStatus.ABSENT).count();

        stats.setMyTotalRegistrations(activeCount);
        stats.setMyUpcomingRegistrations(upcomingCount);
        stats.setMyAttendedCount(attended);
        stats.setMyAbsentCount(absent);

        stats.setRecentRegistrations(
                regs.stream().limit(5).map(RegistrationResponse::new).collect(Collectors.toList())
        );

        return stats;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers(Role role, String search) {
        return userRepository.searchUsers(role, (search != null && !search.trim().isEmpty()) ? search.trim() : null)
                .stream().map(UserResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserStatus(Long userId, UserStatusUpdateRequest req, Authentication auth) {
        User currentUser = authService.getAuthenticatedUser(auth);
        if (currentUser.getId().equals(userId) && !req.getActive()) {
            throw new BadRequestException("You cannot deactivate your own administrator account.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setActive(req.getActive());
        user = userRepository.save(user);
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, UserRoleUpdateRequest req, Authentication auth) {
        User currentUser = authService.getAuthenticatedUser(auth);
        if (currentUser.getId().equals(userId) && req.getRole() != Role.ADMIN) {
            throw new BadRequestException("You cannot remove administrator role from yourself.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setRole(req.getRole());
        user = userRepository.save(user);
        return new UserResponse(user);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getAllRegistrations(Long eventId, RegistrationStatus regStatus, AttendanceStatus attStatus) {
        List<Registration> list = registrationRepository.filterRegistrations(eventId, regStatus, attStatus);
        return list.stream().map(RegistrationResponse::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReportResponse generateReports(Long eventId, LocalDate startDate, LocalDate endDate, String status) {
        ReportResponse report = new ReportResponse();

        // 1. Event Registration Summaries
        List<Event> allEvents = eventRepository.findAll();
        if (eventId != null) {
            allEvents = allEvents.stream().filter(e -> e.getId().equals(eventId)).collect(Collectors.toList());
        }
        if (startDate != null) {
            allEvents = allEvents.stream().filter(e -> !e.getEventDate().isBefore(startDate)).collect(Collectors.toList());
        }
        if (endDate != null) {
            allEvents = allEvents.stream().filter(e -> !e.getEventDate().isAfter(endDate)).collect(Collectors.toList());
        }

        List<ReportResponse.EventRegistrationSummary> eventSummaries = new ArrayList<>();
        for (Event ev : allEvents) {
            ReportResponse.EventRegistrationSummary s = new ReportResponse.EventRegistrationSummary();
            s.setEventId(ev.getId());
            s.setTitle(ev.getTitle());
            s.setCategory(ev.getCategory());
            s.setEventDate(ev.getEventDate());
            s.setCapacity(ev.getCapacity());

            long active = registrationRepository.countByEventIdAndRegistrationStatus(ev.getId(), RegistrationStatus.REGISTERED);
            long pres = registrationRepository.countByEventIdAndAttendanceStatus(ev.getId(), AttendanceStatus.PRESENT);
            long abs = registrationRepository.countByEventIdAndAttendanceStatus(ev.getId(), AttendanceStatus.ABSENT);
            long pend = registrationRepository.countByEventIdAndAttendanceStatus(ev.getId(), AttendanceStatus.PENDING);

            s.setRegisteredCount(active);
            s.setPresentCount(pres);
            s.setAbsentCount(abs);
            s.setPendingCount(pend);

            double fillRate = (ev.getCapacity() > 0) ? ((double) active / ev.getCapacity()) * 100.0 : 0.0;
            double attRate = (pres + abs > 0) ? ((double) pres / (pres + abs)) * 100.0 : 0.0;

            s.setFillRate(Math.round(fillRate * 10.0) / 10.0);
            s.setAttendanceRate(Math.round(attRate * 10.0) / 10.0);

            eventSummaries.add(s);
        }
        report.setEventSummaries(eventSummaries);

        // 2. Student Participation Summaries
        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<ReportResponse.StudentParticipationSummary> studentSummaries = new ArrayList<>();
        for (User st : students) {
            ReportResponse.StudentParticipationSummary ss = new ReportResponse.StudentParticipationSummary();
            ss.setStudentId(st.getId());
            ss.setStudentName(st.getFullName());
            ss.setStudentEmail(st.getEmail());

            long reg = registrationRepository.countByStudentIdAndRegistrationStatus(st.getId(), RegistrationStatus.REGISTERED);
            long can = registrationRepository.countByStudentIdAndRegistrationStatus(st.getId(), RegistrationStatus.CANCELLED);
            long pres = registrationRepository.countByStudentIdAndAttendanceStatus(st.getId(), AttendanceStatus.PRESENT);
            long abs = registrationRepository.countByStudentIdAndAttendanceStatus(st.getId(), AttendanceStatus.ABSENT);

            ss.setTotalRegistered(reg);
            ss.setTotalCancelled(can);
            ss.setTotalPresent(pres);
            ss.setTotalAbsent(abs);

            studentSummaries.add(ss);
        }
        report.setStudentSummaries(studentSummaries);

        // 3. Attendance Summary
        long totalPresent = registrationRepository.countByAttendanceStatus(AttendanceStatus.PRESENT);
        long totalAbsent = registrationRepository.countByAttendanceStatus(AttendanceStatus.ABSENT);
        long totalPending = registrationRepository.countByAttendanceStatus(AttendanceStatus.PENDING);
        double overallAttRate = (totalPresent + totalAbsent > 0) ? ((double) totalPresent / (totalPresent + totalAbsent)) * 100.0 : 0.0;

        ReportResponse.AttendanceSummary attSum = new ReportResponse.AttendanceSummary();
        attSum.setTotalPresent(totalPresent);
        attSum.setTotalAbsent(totalAbsent);
        attSum.setTotalPending(totalPending);
        attSum.setAttendanceRate(Math.round(overallAttRate * 10.0) / 10.0);
        report.setAttendanceSummary(attSum);

        // 4. Registration Status Summary
        long totalReg = registrationRepository.countByRegistrationStatus(RegistrationStatus.REGISTERED);
        long totalCanc = registrationRepository.countByRegistrationStatus(RegistrationStatus.CANCELLED);

        ReportResponse.RegistrationStatusSummary statusSum = new ReportResponse.RegistrationStatusSummary();
        statusSum.setRegistered(totalReg);
        statusSum.setCancelled(totalCanc);
        statusSum.setTotal(totalReg + totalCanc);
        report.setStatusSummary(statusSum);

        // 5. Date-wise Summary
        Map<LocalDate, List<Event>> byDate = allEvents.stream().collect(Collectors.groupingBy(Event::getEventDate));
        List<ReportResponse.DateWiseSummary> dateList = new ArrayList<>();
        for (Map.Entry<LocalDate, List<Event>> entry : byDate.entrySet()) {
            ReportResponse.DateWiseSummary ds = new ReportResponse.DateWiseSummary();
            ds.setDate(entry.getKey());
            ds.setEventCount(entry.getValue().size());
            long regs = entry.getValue().stream()
                    .mapToLong(e -> registrationRepository.countByEventIdAndRegistrationStatus(e.getId(), RegistrationStatus.REGISTERED))
                    .sum();
            ds.setTotalRegistrations(regs);
            dateList.add(ds);
        }
        dateList.sort(Comparator.comparing(ReportResponse.DateWiseSummary::getDate));
        report.setDateWiseSummaries(dateList);

        return report;
    }

    @Transactional(readOnly = true)
    public String generateCsvReport(Long eventId, LocalDate startDate, LocalDate endDate, String status) {
        List<Registration> regs = registrationRepository.findAll();

        if (eventId != null) {
            regs = regs.stream().filter(r -> r.getEvent().getId().equals(eventId)).collect(Collectors.toList());
        }
        if (startDate != null) {
            regs = regs.stream().filter(r -> !r.getEvent().getEventDate().isBefore(startDate)).collect(Collectors.toList());
        }
        if (endDate != null) {
            regs = regs.stream().filter(r -> !r.getEvent().getEventDate().isAfter(endDate)).collect(Collectors.toList());
        }
        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            regs = regs.stream().filter(r -> r.getRegistrationStatus().name().equalsIgnoreCase(status)).collect(Collectors.toList());
        }

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        // CSV Header
        pw.println("Registration ID,Student Name,Student Email,Event Title,Category,Event Date,Venue,Registration Date,Registration Status,Attendance Status");

        for (Registration r : regs) {
            pw.printf("\"%d\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    r.getId(),
                    escapeCsv(r.getStudent().getFullName()),
                    escapeCsv(r.getStudent().getEmail()),
                    escapeCsv(r.getEvent().getTitle()),
                    escapeCsv(r.getEvent().getCategory()),
                    r.getEvent().getEventDate().toString(),
                    escapeCsv(r.getEvent().getVenue()),
                    r.getRegistrationDate().toString(),
                    r.getRegistrationStatus().name(),
                    r.getAttendanceStatus().name()
            );
        }

        pw.flush();
        return sw.toString();
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        return val.replace("\"", "\"\"");
    }
}
