package com.example.expensesplitcalculator.service;

import com.example.expensesplitcalculator.dto.GroupDto;
import com.example.expensesplitcalculator.dto.UserDto;
import com.example.expensesplitcalculator.model.Group;
import com.example.expensesplitcalculator.model.User;
import com.example.expensesplitcalculator.repository.GroupRepository;
import com.example.expensesplitcalculator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public GroupDto createGroup(String name, String description, List<String> memberEmails) {
        User currentUser = userService.getCurrentUser();
        
        Group group = new Group();
        group.setName(name);
        group.setDescription(description);
        group.setCreatedBy(currentUser);
        
        // Add current user as a member
        group.getMembers().add(currentUser);
        currentUser.getGroups().add(group);
        
        // Add other members
        for (String email : memberEmails) {
            userRepository.findByEmail(email).ifPresent(user -> {
                group.getMembers().add(user);
                user.getGroups().add(group);
            });
        }
        
        Group savedGroup = groupRepository.save(group);
        return convertToDto(savedGroup);
    }

    public List<GroupDto> getUserGroups() {
        User currentUser = userService.getCurrentUser();
        List<Group> groups = groupRepository.findByMembersContaining(currentUser);
        return groups.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public GroupDto getGroupById(Long id) {
        User currentUser = userService.getCurrentUser();
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
        
        // Check if user is a member of the group
        if (!group.getMembers().contains(currentUser)) {
            throw new RuntimeException("You are not a member of this group");
        }
        
        return convertToDetailedDto(group);
    }

    @Transactional
    public GroupDto joinGroup(String inviteCode) {
        User currentUser = userService.getCurrentUser();
        
        Group group = groupRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invitation code"));
        
        // Check if user is already a member
        if (group.getMembers().contains(currentUser)) {
            throw new RuntimeException("You are already a member of this group");
        }
        
        // Add user to group
        group.getMembers().add(currentUser);
        currentUser.getGroups().add(group);
        
        Group savedGroup = groupRepository.save(group);
        return convertToDto(savedGroup);
    }

    private GroupDto convertToDto(Group group) {
        GroupDto dto = new GroupDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setMemberCount(group.getMembers().size());
        
        // Calculate total expenses (in a real app, this would be more efficient)
        BigDecimal totalExpenses = group.getExpenses().stream()
                .map(expense -> expense.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalExpenses(totalExpenses);
        
        dto.setCreatedAt(group.getCreatedAt());
        
        // Calculate recent activity
        LocalDateTime now = LocalDateTime.now();
        long days = ChronoUnit.DAYS.between(group.getCreatedAt(), now);
        if (days == 0) {
            dto.setRecentActivity("today");
        } else if (days == 1) {
            dto.setRecentActivity("yesterday");
        } else if (days < 7) {
            dto.setRecentActivity(days + " days ago");
        } else {
            dto.setRecentActivity(days / 7 + " weeks ago");
        }
        
        return dto;
    }

    private GroupDto convertToDetailedDto(Group group) {
        GroupDto dto = convertToDto(group);
        
        // Add members
        List<UserDto> memberDtos = new ArrayList<>();
        for (User member : group.getMembers()) {
            memberDtos.add(userService.getUserDto(member));
        }
        dto.setMembers(memberDtos);
        
        // Add created by
        if (group.getCreatedBy() != null) {
            dto.setCreatedBy(userService.getUserDto(group.getCreatedBy()));
        }
        
        return dto;
    }
}
