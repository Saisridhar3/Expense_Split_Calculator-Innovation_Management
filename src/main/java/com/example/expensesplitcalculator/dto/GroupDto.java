package com.example.expensesplitcalculator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupDto {
    private Long id;
    private String name;
    private String description;
    private String inviteCode;
    private int memberCount;
    private BigDecimal totalExpenses;
    private LocalDateTime createdAt;
    private String recentActivity;
    private List<UserDto> members;
    private UserDto createdBy;
}
