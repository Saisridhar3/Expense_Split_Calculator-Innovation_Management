package com.example.expensesplitcalculator.controller;

import com.example.expensesplitcalculator.dto.AuthRequest;
import com.example.expensesplitcalculator.dto.AuthResponse;
import com.example.expensesplitcalculator.dto.RegisterRequest;
import com.example.expensesplitcalculator.dto.UserDto;
import com.example.expensesplitcalculator.model.User;
import com.example.expensesplitcalculator.security.JwtTokenProvider;
import com.example.expensesplitcalculator.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userService.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDto userDto = userService.getUserDto(user);
        
        return ResponseEntity.ok(new AuthResponse(jwt, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        User user = userService.createUser(
                registerRequest.getName(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
        );

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // In a stateless JWT authentication, server-side logout is not needed
        // The client should remove the token
        return ResponseEntity.ok("Logged out successfully");
    }
}
