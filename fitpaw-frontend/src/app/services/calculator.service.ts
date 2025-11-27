import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private apiUrl = 'https://192.168.0.108:3001/api'; //backend port


  constructor(private http: HttpClient) { }

  //FBMI
  calculateFBMI(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bmi/calculate`, data);
  }

  //CIC
  calculateCalories(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calorie/calculate`, data);
  }

  //FIC
  calculateFoodIntake(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/feeding-plan/calculate`, data);
  }

  //AC
  convertAge(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/age/convert`, data);
  }

  //Barcode lookup
  lookupFoodByBarcode(barcode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/food/lookup/${barcode}`);
  }
}