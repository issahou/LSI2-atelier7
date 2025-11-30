import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeeService } from '../../services/employee.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employee?: Employee;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadEmployee();
  }

  loadEmployee(): void {
    const id = +this.route.snapshot.params['id'];
    if (id) {
      this.isLoading = true;
      this.employeeService.getEmployee(id).subscribe({
        next: (employee) => {
          this.employee = employee;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des détails de l\'employé';
          this.isLoading = false;
          console.error('Error loading employee details:', err);
        }
      });
    }
  }

  editEmployee(): void {
    if (this.employee?.id) {
      this.router.navigate(['/employees/edit', this.employee.id]);
    }
  }

  deleteEmployee(): void {
    if (this.employee?.id && confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeeService.deleteEmployee(this.employee.id).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'employé';
          console.error('Error deleting employee:', err);
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(salary);
  }
}