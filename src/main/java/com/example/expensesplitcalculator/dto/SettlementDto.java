package com.example.expensesplitcalculator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettlementDto {
    private Long id;
    private UserDto fromUser;
    private UserDto toUser;
    private BigDecimal amount;
    private LocalDate date;
    private Long groupId;
    private String groupName;
    private String notes;
}
