package com.example.expensesplitcalculator.repository;

import com.example.expensesplitcalculator.model.Expense;
import com.example.expensesplitcalculator.model.ExpenseSplit;
import com.example.expensesplitcalculator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    List<ExpenseSplit> findByExpense(Expense expense);
    List<ExpenseSplit> findByUser(User user);
    List<ExpenseSplit> findByUserAndSettled(User user, boolean settled);
}
