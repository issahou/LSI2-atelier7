import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchKeyword = '';
  selectedDepartment = '';
  averageSalary = 0;
  isLoading = false;

  departments = ['IT', 'RH', 'Finance', 'Marketing', 'Production', 'Commercial'];

  constructor(
    private employeeService: EmployeeService,
    public router: Router // Changez de 'private' à 'public'
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAverageSalary();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.isLoading = false;
      }
    });
  }

  loadAverageSalary(): void {
    this.employeeService.getAverageSalary().subscribe({
      next: (data) => {
        this.averageSalary = data.averageSalary;
      },
      error: (err) => {
        console.error('Error loading average salary:', err);
      }
    });
  }

  searchEmployees(): void {
    if (this.searchKeyword.trim()) {
      this.employeeService.searchEmployees(this.searchKeyword).subscribe({
        next: (data) => this.filteredEmployees = data,
        error: (err) => console.error('Search error:', err)
      });
    } else {
      this.filteredEmployees = this.employees;
    }
  }

  filterByDepartment(): void {
    if (this.selectedDepartment) {
      this.employeeService.getEmployeesByDepartment(this.selectedDepartment).subscribe({
        next: (data) => this.filteredEmployees = data,
        error: (err) => console.error('Filter error:', err)
      });
    } else {
      this.filteredEmployees = this.employees;
    }
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.selectedDepartment = '';
    this.filteredEmployees = this.employees;
  }

  deleteEmployee(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
          this.loadAverageSalary();
        },
        error: (err) => console.error('Delete error:', err)
      });
    }
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  viewEmployee(id: number): void {
    this.router.navigate(['/employees', id]);
  }

  // Nouvelle méthode pour naviguer vers le formulaire d'ajout
  addEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  getTotalEmployees(): number {
    return this.filteredEmployees.length;
  }

  getCurrentAverageSalary(): number {
    if (this.filteredEmployees.length === 0) return 0;
    const total = this.filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    return total / this.filteredEmployees.length;
  }
}