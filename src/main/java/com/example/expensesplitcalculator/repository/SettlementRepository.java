package com.example.expensesplitcalculator.repository;

import com.example.expensesplitcalculator.model.Group;
import com.example.expensesplitcalculator.model.Settlement;
import com.example.expensesplitcalculator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    List<Settlement> findByFrom(User from);
    List<Settlement> findByTo(User to);
    List<Settlement> findByGroup(Group group);
}
