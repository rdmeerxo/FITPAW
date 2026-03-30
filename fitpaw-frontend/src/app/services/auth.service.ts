import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://fitpaw-production.up.railway.app/api'; 

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, password }).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem('fitpaw_token');
    localStorage.removeItem('fitpaw_user');
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('fitpaw_token');
  }

  getUser(): User | null {
    const u = localStorage.getItem('fitpaw_user');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveSession(res: any): void {
    localStorage.setItem('fitpaw_token', res.token);
    localStorage.setItem('fitpaw_user', JSON.stringify(res.user));
  }
}
