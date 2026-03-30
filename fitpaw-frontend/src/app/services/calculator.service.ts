import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private apiUrl = 'https://fitpaw-production.up.railway.app/api'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── Calculators (public) ──────────────────────────────
  calculateFBMI(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bmi/calculate`, data);
  }

  calculateCalories(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calorie/calculate`, data);
  }

  calculateFoodIntake(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/feeding-plan/calculate`, data);
  }

  convertAge(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/age/convert`, data);
  }

  lookupFoodByBarcode(barcode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/food/lookup/${barcode}`);
  }

  // ── Cats (protected) ─────────────────────────────────
  getCats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cats`, { headers: this.authHeaders() });
  }

  createCat(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cats`, data, { headers: this.authHeaders() });
  }

  updateCat(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cats/${id}`, data, { headers: this.authHeaders() });
  }

  deleteCat(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cats/${id}`, { headers: this.authHeaders() });
  }

  // ── Logs (protected) ─────────────────────────────────
  getLogs(catId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cats/${catId}/logs`, { headers: this.authHeaders() });
  }

  addLog(catId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cats/${catId}/logs`, data, { headers: this.authHeaders() });
  }

  deleteLog(catId: number, logId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cats/${catId}/logs/${logId}`, { headers: this.authHeaders() });
  }
}
