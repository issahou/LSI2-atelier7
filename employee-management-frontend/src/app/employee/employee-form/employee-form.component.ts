import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEdit = false;
  employeeId?: number;
  isLoading = false;
  errorMessage = '';

  departments = ['IT', 'RH', 'Finance', 'Marketing', 'Production', 'Commercial', 'Direction'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.employeeId = +params['id'];
        this.loadEmployee(this.employeeId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      salary: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
      department: [''],
      phoneNumber: ['', [Validators.pattern('^[+]?[0-9]{10,15}$')]],
      hireDate: ['']
    });
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          salary: employee.salary,
          department: employee.department || '',
          phoneNumber: employee.phoneNumber || '',
          hireDate: employee.hireDate || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de l\'employé';
        this.isLoading = false;
        console.error('Error loading employee:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const employee: Employee = {
        firstName: this.employeeForm.get('firstName')?.value,
        lastName: this.employeeForm.get('lastName')?.value,
        email: this.employeeForm.get('email')?.value,
        salary: this.employeeForm.get('salary')?.value,
        department: this.employeeForm.get('department')?.value || null,
        phoneNumber: this.employeeForm.get('phoneNumber')?.value || null,
        hireDate: this.employeeForm.get('hireDate')?.value || null
      };

      const operation = this.isEdit && this.employeeId
        ? this.employeeService.updateEmployee(this.employeeId, employee)
        : this.employeeService.createEmployee(employee);

      operation.subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || 'Erreur lors de la sauvegarde de l\'employé';
          console.error('Error saving employee:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      this.employeeForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  get firstName() { return this.employeeForm.get('firstName'); }
  get lastName() { return this.employeeForm.get('lastName'); }
  get email() { return this.employeeForm.get('email'); }
  get salary() { return this.employeeForm.get('salary'); }
  get phoneNumber() { return this.employeeForm.get('phoneNumber'); }
}