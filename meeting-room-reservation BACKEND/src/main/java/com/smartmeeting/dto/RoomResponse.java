package com.smartmeeting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long id;
    private String name;
    private int capacity;
    private String equipment;
}
