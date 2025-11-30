package com.fstt.employee.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le prénom est obligatoire")
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Email(message = "L'email doit être valide")
    @NotBlank(message = "L'email est obligatoire")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotNull(message = "Le salaire est obligatoire")
    @Positive(message = "Le salaire doit être positif")
    @Column(nullable = false)
    private Double salary;

    @Column(length = 50)
    private String department;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "hire_date")
    private java.time.LocalDate hireDate;
}