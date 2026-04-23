package com.example.expensesplitcalculator.repository;

import com.example.expensesplitcalculator.model.Group;
import com.example.expensesplitcalculator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByMembersContaining(User user);
    Optional<Group> findByInviteCode(String inviteCode);
}
