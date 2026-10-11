package com.college.event.repository;

import com.college.event.entity.Event;
import com.college.event.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganizerIdOrderByEventDateAscStartTimeAsc(Long organizerId);

    List<Event> findByStatusOrderByEventDateAscStartTimeAsc(EventStatus status);

    long countByStatus(EventStatus status);

    long countByOrganizerId(Long organizerId);

    @Query("SELECT e FROM Event e WHERE " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR e.category = :category) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:date IS NULL OR e.eventDate = :date) " +
           "ORDER BY e.eventDate ASC, e.startTime ASC")
    List<Event> filterEvents(@Param("search") String search,
                             @Param("category") String category,
                             @Param("status") EventStatus status,
                             @Param("date") LocalDate date);

    @Query("SELECT DISTINCT e.category FROM Event e ORDER BY e.category ASC")
    List<String> findDistinctCategories();
}
