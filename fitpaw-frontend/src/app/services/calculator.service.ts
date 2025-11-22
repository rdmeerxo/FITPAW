import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private apiUrl = 'http://localhost:3000/api/calculate'; //backend port

  constructor(private http: HttpClient) { }

  //FBMI calc
  calculateFBMI(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/fbmi`, data);
  }

  //CIC
  calculateCalories(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calories`, data);
  }

  //FIC
  calculateFoodIntake(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/food-intake`, data);
  }

  //AC
  convertAge(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/age-converter`, data);
  }
}
