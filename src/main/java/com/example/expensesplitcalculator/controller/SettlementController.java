package com.example.expensesplitcalculator.controller;

import com.example.expensesplitcalculator.dto.SettlementDto;
import com.example.expensesplitcalculator.service.SettlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/settlements")
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    @PostMapping
    public ResponseEntity<SettlementDto> recordPayment(@RequestBody SettlementDto settlementDto) {
        SettlementDto createdSettlement = settlementService.recordPayment(settlementDto);
        return ResponseEntity.ok(createdSettlement);
    }

    @GetMapping
    public ResponseEntity<List<SettlementDto>> getUserSettlements() {
        List<SettlementDto> settlements = settlementService.getUserSettlements();
        return ResponseEntity.ok(settlements);
    }
}
