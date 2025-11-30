import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Utilisez le chemin correct
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  salary: number;
  department?: string;
  phoneNumber?: string;
  hireDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': this.authService.getAuthHeader(),
      'Content-Type': 'application/json'
    });
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee, {
      headers: this.getHeaders()
    });
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee, {
      headers: this.getHeaders()
    });
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getEmployeesByDepartment(department: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/department/${department}`, {
      headers: this.getHeaders()
    });
  }

  searchEmployees(keyword: string): Observable<Employee[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Employee[]>(`${this.apiUrl}/search`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  getEmployeesBySalaryRange(min: number, max: number): Observable<Employee[]> {
    const params = new HttpParams()
      .set('min', min.toString())
      .set('max', max.toString());
    
    return this.http.get<Employee[]>(`${this.apiUrl}/salary-range`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  getAverageSalary(): Observable<{ averageSalary: number }> {
    return this.http.get<{ averageSalary: number }>(`${this.apiUrl}/stats/average-salary`, {
      headers: this.getHeaders()
    });
  }
}