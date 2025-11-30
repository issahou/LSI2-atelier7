import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.username || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Identifiants incorrects';
        console.error('Login error:', err);
      }
    });
  }
}