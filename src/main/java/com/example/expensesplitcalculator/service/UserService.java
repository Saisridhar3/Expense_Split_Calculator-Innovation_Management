package com.example.expensesplitcalculator.service;

import com.example.expensesplitcalculator.dto.UserDto;
import com.example.expensesplitcalculator.model.User;
import com.example.expensesplitcalculator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    public UserDto getUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAvatar(user.getAvatar());
        dto.setPhone(user.getPhone());
        dto.setCurrency(user.getCurrency());
        
        // Check if this is the current user
        User currentUser = getCurrentUser();
        dto.setCurrentUser(user.getId().equals(currentUser.getId()));
        
        return dto;
    }

    public UserDto getUserDtoById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return getUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(UserDto userDto) {
        User currentUser = getCurrentUser();
        
        if (userDto.getName() != null) {
            currentUser.setName(userDto.getName());
        }
        
        if (userDto.getPhone() != null) {
            currentUser.setPhone(userDto.getPhone());
        }
        
        if (userDto.getCurrency() != null) {
            currentUser.setCurrency(userDto.getCurrency());
        }
        
        if (userDto.getAvatar() != null) {
            currentUser.setAvatar(userDto.getAvatar());
        }
        
        User updatedUser = userRepository.save(currentUser);
        return getUserDto(updatedUser);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(String name, String email, String password) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        
        // Generate a default avatar
        int avatarNumber = (int) (Math.random() * 4) + 1;
        user.setAvatar("/images/avatar-" + avatarNumber + ".png");
        
        return userRepository.save(user);
    }
}
