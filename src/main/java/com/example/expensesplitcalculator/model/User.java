package com.example.expensesplitcalculator.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String avatar;
    
    private String phone;
    
    private String currency = "INR";
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_groups",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    private Set<Group> groups = new HashSet<>();
    
    @OneToMany(mappedBy = "paidBy", cascade = CascadeType.ALL)
    private Set<Expense> paidExpenses = new HashSet<>();
    
    @ManyToMany(mappedBy = "participants")
    private Set<Expense> participatingExpenses = new HashSet<>();
}
