package com.example.expensesplitcalculator.service;

import com.example.expensesplitcalculator.dto.SettlementDto;
import com.example.expensesplitcalculator.model.ExpenseSplit;
import com.example.expensesplitcalculator.model.Group;
import com.example.expensesplitcalculator.model.Settlement;
import com.example.expensesplitcalculator.model.User;
import com.example.expensesplitcalculator.repository.ExpenseSplitRepository;
import com.example.expensesplitcalculator.repository.GroupRepository;
import com.example.expensesplitcalculator.repository.SettlementRepository;
import com.example.expensesplitcalculator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettlementService {

    @Autowired
    private SettlementRepository settlementRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ExpenseSplitRepository expenseSplitRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public SettlementDto recordPayment(SettlementDto settlementDto) {
        User currentUser = userService.getCurrentUser();
        
        // Get the recipient
        User toUser = userRepository.findById(settlementDto.getToUser().getId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        
        // Create the settlement
        Settlement settlement = new Settlement();
        settlement.setFrom(currentUser);
        settlement.setTo(toUser);
        settlement.setAmount(settlementDto.getAmount());
        settlement.setDate(settlementDto.getDate());
        settlement.setNotes(settlementDto.getNotes());
        
        // Set group if provided
        if (settlementDto.getGroupId() != null) {
            Group group = groupRepository.findById(settlementDto.getGroupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            
            // Check if both users are members of the group
            if (!group.getMembers().contains(currentUser) || !group.getMembers().contains(toUser)) {
                throw new RuntimeException("Both users must be members of the group");
            }
            
            settlement.setGroup(group);
        }
        
        Settlement savedSettlement = settlementRepository.save(settlement);
        
        // Update expense splits if in a group
        if (settlement.getGroup() != null) {
            // Find unsettled splits where current user owes money to the recipient
            List<ExpenseSplit> splits = expenseSplitRepository.findByUserAndSettled(currentUser, false);
            
            BigDecimal remainingAmount = settlement.getAmount();
            
            for (ExpenseSplit split : splits) {
                // Only consider splits where the payer is the recipient
                if (split.getExpense().getPaidBy().equals(toUser)) {
                    if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                        break;
                    }
                    
                    if (remainingAmount.compareTo(split.getAmount()) >= 0) {
                        // Fully settle this split
                        split.setSettled(true);
                        remainingAmount = remainingAmount.subtract(split.getAmount());
                    } else {
                        // Partially settle this split (in a real app, you might handle this differently)
                        split.setSettled(true);
                        remainingAmount = BigDecimal.ZERO;
                    }
                    
                    expenseSplitRepository.save(split);
                }
            }
        }
        
        return convertToDto(savedSettlement);
    }

    public List<SettlementDto> getUserSettlements() {
        User currentUser = userService.getCurrentUser();
        
        // Get settlements where current user is either the payer or recipient
        List<Settlement> fromSettlements = settlementRepository.findByFrom(currentUser);
        List<Settlement> toSettlements = settlementRepository.findByTo(currentUser);
        
        // Combine and convert to DTOs
        List<SettlementDto> result = fromSettlements.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        result.addAll(toSettlements.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()));
        
        return result;
    }

    private SettlementDto convertToDto(Settlement settlement) {
        SettlementDto dto = new SettlementDto();
        dto.setId(settlement.getId());
        dto.setFromUser(userService.getUserDto(settlement.getFrom()));
        dto.setToUser(userService.getUserDto(settlement.getTo()));
        dto.setAmount(settlement.getAmount());
        dto.setDate(settlement.getDate());
        dto.setNotes(settlement.getNotes());
        
        if (settlement.getGroup() != null) {
            dto.setGroupId(settlement.getGroup().getId());
            dto.setGroupName(settlement.getGroup().getName());
        }
        
        return dto;
    }
}
