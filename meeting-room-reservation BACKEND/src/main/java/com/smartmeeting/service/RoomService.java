package com.smartmeeting.service;

import com.smartmeeting.dto.*;
import com.smartmeeting.entity.Room;
import com.smartmeeting.exception.ResourceNotFoundException;
import com.smartmeeting.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomResponse create(RoomRequest request) {
        Room room = Room.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .equipment(request.getEquipment())
                .build();
        return toResponse(roomRepository.save(room));
    }

    public RoomResponse update(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        room.setName(request.getName());
        room.setCapacity(request.getCapacity());
        room.setEquipment(request.getEquipment());
        return toResponse(roomRepository.save(room));
    }

    public void delete(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found");
        }
        roomRepository.deleteById(id);
    }

    public List<RoomResponse> getAll() {
        return roomRepository.findAll().stream().map(this::toResponse).toList();
    }

    public RoomResponse getById(Long id) {
        return toResponse(roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found")));
    }

    public List<RoomResponse> getAvailable(LocalDate date, LocalTime startTime, LocalTime endTime) {
        return roomRepository.findAvailableRooms(date, startTime, endTime)
                .stream().map(this::toResponse).toList();
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .capacity(room.getCapacity())
                .equipment(room.getEquipment())
                .build();
    }
}
