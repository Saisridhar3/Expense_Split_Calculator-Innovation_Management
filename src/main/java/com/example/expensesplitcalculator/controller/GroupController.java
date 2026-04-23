package com.example.expensesplitcalculator.controller;

import com.example.expensesplitcalculator.dto.GroupDto;
import com.example.expensesplitcalculator.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping
    public ResponseEntity<List<GroupDto>> getUserGroups() {
        List<GroupDto> groups = groupService.getUserGroups();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDto> getGroupById(@PathVariable Long id) {
        GroupDto group = groupService.getGroupById(id);
        return ResponseEntity.ok(group);
    }

    @PostMapping
    public ResponseEntity<GroupDto> createGroup(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        @SuppressWarnings("unchecked")
        List<String> members = (List<String>) request.get("members");
        
        GroupDto createdGroup = groupService.createGroup(name, description, members);
        return ResponseEntity.ok(createdGroup);
    }

    @PostMapping("/join")
    public ResponseEntity<GroupDto> joinGroup(@RequestBody Map<String, String> request) {
        String inviteCode = request.get("inviteCode");
        GroupDto joinedGroup = groupService.joinGroup(inviteCode);
        return ResponseEntity.ok(joinedGroup);
    }
}
