package com.smartmeeting.repository;

import com.smartmeeting.entity.Reservation;
import com.smartmeeting.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
           "WHERE r.room.id = :roomId " +
           "AND r.date = :date " +
           "AND r.status = com.smartmeeting.entity.ReservationStatus.CONFIRMED " +
           "AND r.startTime < :endTime " +
           "AND r.endTime > :startTime")
    boolean existsConflict(@Param("roomId") Long roomId,
                           @Param("date") LocalDate date,
                           @Param("startTime") LocalTime startTime,
                           @Param("endTime") LocalTime endTime);
}
