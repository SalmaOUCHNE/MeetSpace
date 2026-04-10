package com.smartmeeting.service;

import com.smartmeeting.dto.*;
import com.smartmeeting.entity.*;
import com.smartmeeting.exception.*;
import com.smartmeeting.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReservationResponse create(ReservationRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }

        if (reservationRepository.existsConflict(request.getRoomId(), request.getDate(),
                request.getStartTime(), request.getEndTime())) {
            throw new ConflictException("Room is already booked for the requested time slot");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        Reservation reservation = Reservation.builder()
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(ReservationStatus.CONFIRMED)
                .user(user)
                .room(room)
                .build();

        return toResponse(reservationRepository.save(reservation));
    }

    public ReservationResponse cancel(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!reservation.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You can only cancel your own reservations");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        return toResponse(reservationRepository.save(reservation));
    }

    public List<ReservationResponse> getMyReservations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return reservationRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).toList();
    }

    private ReservationResponse toResponse(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId())
                .date(r.getDate())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .status(r.getStatus().name())
                .userName(r.getUser().getName())
                .roomName(r.getRoom().getName())
                .build();
    }

    public List<ReservationResponse> getAll() {
        return reservationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }
}
