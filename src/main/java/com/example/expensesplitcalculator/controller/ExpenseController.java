package com.example.expensesplitcalculator.controller;

import com.example.expensesplitcalculator.dto.ExpenseDto;
import com.example.expensesplitcalculator.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDto> addExpense(@RequestBody ExpenseDto expenseDto) {
        ExpenseDto createdExpense = expenseService.addExpense(expenseDto);
        return ResponseEntity.ok(createdExpense);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ExpenseDto>> getGroupExpenses(@PathVariable Long groupId) {
        List<ExpenseDto> expenses = expenseService.getGroupExpenses(groupId);
        return ResponseEntity.ok(expenses);
    }
}
