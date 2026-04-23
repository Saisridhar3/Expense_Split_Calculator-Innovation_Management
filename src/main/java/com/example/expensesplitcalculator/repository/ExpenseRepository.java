package com.example.expensesplitcalculator.repository;

import com.example.expensesplitcalculator.model.Expense;
import com.example.expensesplitcalculator.model.Group;
import com.example.expensesplitcalculator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroup(Group group);
    List<Expense> findByPaidBy(User user);
    List<Expense> findByParticipantsContaining(User user);
}
