package com.example.expensesplitcalculator.service;

import com.example.expensesplitcalculator.dto.ExpenseDto;
import com.example.expensesplitcalculator.dto.UserDto;
import com.example.expensesplitcalculator.model.*;
import com.example.expensesplitcalculator.repository.ExpenseRepository;
import com.example.expensesplitcalculator.repository.ExpenseSplitRepository;
import com.example.expensesplitcalculator.repository.GroupRepository;
import com.example.expensesplitcalculator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseSplitRepository expenseSplitRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public ExpenseDto addExpense(ExpenseDto expenseDto) {
        User currentUser = userService.getCurrentUser();
        
        // Get the group
        Group group = groupRepository.findById(expenseDto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            throw new RuntimeException("You are not a member of this group");
        }
        
        // Get the payer
        User paidBy = userRepository.findById(expenseDto.getPaidBy().getId())
                .orElseThrow(() -> new RuntimeException("Payer not found"));
        
        // Create the expense
        Expense expense = new Expense();
        expense.setDescription(expenseDto.getDescription());
        expense.setAmount(expenseDto.getAmount());
        expense.setDate(expenseDto.getDate());
        expense.setGroup(group);
        expense.setPaidBy(paidBy);
        expense.setSplitType(expenseDto.getSplitType());
        
        // Determine category based on description
        expense.setCategory(determineCategory(expenseDto.getDescription()));
        
        // Add all group members as participants
        expense.getParticipants().addAll(group.getMembers());
        
        Expense savedExpense = expenseRepository.save(expense);
        
        // Create expense splits
        if ("equal".equals(expenseDto.getSplitType())) {
            // Equal split
            BigDecimal splitAmount = expense.getAmount()
                    .divide(BigDecimal.valueOf(group.getMembers().size()), 2, RoundingMode.HALF_UP);
            
            for (User member : group.getMembers()) {
                ExpenseSplit split = new ExpenseSplit();
                split.setExpense(savedExpense);
                split.setUser(member);
                split.setAmount(splitAmount);
                split.setSettled(member.equals(paidBy)); // Payer's share is already settled
                
                expenseSplitRepository.save(split);
            }
        } else if ("custom".equals(expenseDto.getSplitType()) && expenseDto.getSplits() != null) {
            // Custom split
            for (Map.Entry<Long, BigDecimal> entry : expenseDto.getSplits().entrySet()) {
                User member = userRepository.findById(entry.getKey())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                ExpenseSplit split = new ExpenseSplit();
                split.setExpense(savedExpense);
                split.setUser(member);
                split.setAmount(entry.getValue());
                split.setSettled(member.equals(paidBy)); // Payer's share is already settled
                
                expenseSplitRepository.save(split);
            }
        }
        
        return convertToDto(savedExpense);
    }

    public List<ExpenseDto> getGroupExpenses(Long groupId) {
        User currentUser = userService.getCurrentUser();
        
        // Get the group
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            throw new RuntimeException("You are not a member of this group");
        }
        
        List  {
            throw new RuntimeException("You are not a member of this group");
        }
        
        List<Expense> expenses = expenseRepository.findByGroup(group);
        return expenses.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ExpenseDto convertToDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setDate(expense.getDate());
        dto.setGroupId(expense.getGroup().getId());
        dto.setPaidBy(userService.getUserDto(expense.getPaidBy()));
        dto.setSplitType(expense.getSplitType());
        dto.setCategory(expense.getCategory());
        
        // Get participants
        List<UserDto> participants = expense.getParticipants().stream()
                .map(user -> userService.getUserDto(user))
                .collect(Collectors.toList());
        dto.setParticipants(participants);
        
        // Get splits
        Map<Long, BigDecimal> splits = new HashMap<>();
        User currentUser = userService.getCurrentUser();
        BigDecimal yourShare = BigDecimal.ZERO;
        boolean isSettled = true;
        
        List<ExpenseSplit> expenseSplits = expenseSplitRepository.findByExpense(expense);
        for (ExpenseSplit split : expenseSplits) {
            splits.put(split.getUser().getId(), split.getAmount());
            
            if (split.getUser().getId().equals(currentUser.getId())) {
                yourShare = split.getAmount();
                isSettled = split.isSettled();
            }
        }
        
        dto.setSplits(splits);
        dto.setYourShare(yourShare);
        dto.setSettled(isSettled);
        
        return dto;
    }

    private String determineCategory(String description) {
        description = description.toLowerCase();
        
        if (description.contains("dinner") || description.contains("lunch") || 
            description.contains("breakfast") || description.contains("restaurant")) {
            return "food";
        } else if (description.contains("hotel") || description.contains("airbnb") || 
                   description.contains("accommodation")) {
            return "accommodation";
        } else if (description.contains("taxi") || description.contains("uber") || 
                   description.contains("lyft") || description.contains("train") || 
                   description.contains("bus")) {
            return "transport";
        } else if (description.contains("grocery") || description.contains("supermarket")) {
            return "groceries";
        } else if (description.contains("flight") || description.contains("plane")) {
            return "travel";
        } else {
            return "default";
        }
    }
}
