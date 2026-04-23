package com.example.expensesplitcalculator.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false, unique = true)
    private String inviteCode;
    
    @ManyToMany(mappedBy = "groups")
    private Set<User> members = new HashSet<>();
    
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private Set<Expense> expenses = new HashSet<>();
    
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (inviteCode == null || inviteCode.isEmpty()) {
            inviteCode = UUID.randomUUID().toString().substring(0, 8);
        }
    }
}
