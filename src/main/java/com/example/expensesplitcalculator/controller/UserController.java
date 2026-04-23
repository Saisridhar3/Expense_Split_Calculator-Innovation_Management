package com.example.expensesplitcalculator.controller;

import com.example.expensesplitcalculator.dto.UserDto;
import com.example.expensesplitcalculator.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        UserDto userDto = userService.getUserDto(userService.getCurrentUser());
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateProfile(userDto);
        return ResponseEntity.ok(updatedUser);
    }
}
