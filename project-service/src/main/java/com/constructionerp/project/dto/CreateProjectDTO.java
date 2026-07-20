package com.constructionerp.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * 프로젝트 생성 요청을 전달하기 위한 DTO의 기본 골격이다.
 */
@Data
@NoArgsConstructor
public class CreateProjectDTO {
    @NotBlank(message = "프로젝트 이름은 필수입니다.")
    private String name;

    private String description;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;

    @PositiveOrZero(message = "예산은 0 이상이어야 합니다.")
    private BigDecimal budget;

    private String status;
    private UUID projectManagerId;
}
