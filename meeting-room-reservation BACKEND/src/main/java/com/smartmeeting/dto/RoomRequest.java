package com.smartmeeting.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoomRequest {
    @NotBlank
    private String name;

    @Min(1)
    private int capacity;

    private String equipment;
}
