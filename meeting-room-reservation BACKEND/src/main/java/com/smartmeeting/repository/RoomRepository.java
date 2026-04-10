package com.smartmeeting.repository;

import com.smartmeeting.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT r FROM Room r WHERE r.id NOT IN (" +
           "SELECT res.room.id FROM Reservation res " +
           "WHERE res.date = :date " +
           "AND res.status = com.smartmeeting.entity.ReservationStatus.CONFIRMED " +
           "AND res.startTime < :endTime " +
           "AND res.endTime > :startTime)")
    List<Room> findAvailableRooms(@Param("date") LocalDate date,
                                  @Param("startTime") LocalTime startTime,
                                  @Param("endTime") LocalTime endTime);
}
