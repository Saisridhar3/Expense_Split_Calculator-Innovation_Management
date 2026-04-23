package com.example.expensesplitcalculator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDto {
    private Long id;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    private Long groupId;
    private UserDto paidBy;
    private String splitType;
    private List<UserDto> participants;
    private Map<Long, BigDecimal> splits;
    private String category;
    private BigDecimal yourShare;
    private boolean isSettled;
}
