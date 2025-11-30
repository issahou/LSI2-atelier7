import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

// Utilisez le chemin correct
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const auth = localStorage.getItem('auth');
    this.loggedIn.next(!!auth);
  }

  login(username: string, password: string): Observable<any> {
    const authHeader = 'Basic ' + btoa(username + ':' + password);
    
    return this.http.get(`${this.apiUrl}/employees`, {
      headers: { Authorization: authHeader }
    }).pipe(
      tap(() => {
        this.setAuth(authHeader);
      })
    );
  }

  setAuth(authHeader: string): void {
    localStorage.setItem('auth', authHeader);
    this.loggedIn.next(true);
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.loggedIn.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getAuthHeader(): string {
    return localStorage.getItem('auth') || '';
  }
}