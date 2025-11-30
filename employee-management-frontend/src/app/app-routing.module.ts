import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee/employee-form/employee-form.component';
import { EmployeeDetailsComponent } from './employee/employee-details/employee-details.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: 'employees/new', component: EmployeeFormComponent, canActivate: [AuthGuard] },
  { path: 'employees/edit/:id', component: EmployeeFormComponent, canActivate: [AuthGuard] },
  { path: 'employees/:id', component: EmployeeDetailsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: '**', redirectTo: '/employees' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }