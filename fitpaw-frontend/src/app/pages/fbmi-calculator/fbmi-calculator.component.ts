import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-fbmi-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './fbmi-calculator.component.html',
  styleUrl: './fbmi-calculator.component.css'
})
export class FbmiCalculatorComponent {
  ribCageCircumference: number = 0;
  legLength: number = 0;
  fbmiResult: string = '';
  category: string = '';

  calculateFBMI() {
    if (this.ribCageCircumference > 0 && this.legLength > 0) {
      //main formula for BMI = (((RC/0.7067) - LIM) / 0.9156) - LIM
      const rc = this.ribCageCircumference;
      const lim = this.legLength;
      
      const fbmi = (((rc / 0.7067) - lim) / 0.9156) - lim;
      this.fbmiResult = fbmi.toFixed(2);
      
      //zoom out suitable category
      if (fbmi < 15) {
        this.category = 'underweight';
      } else if (fbmi >= 15 && fbmi < 30) {
        this.category = 'normal';
      } else if (fbmi >= 30 && fbmi <= 42) {
        this.category = 'overweight';
      } else {
        this.category = 'obese';
      }
    } else {
      this.fbmiResult = '';
      this.category = '';
    }
  }

  clearForm() {
    this.ribCageCircumference = 0;
    this.legLength = 0;
    this.fbmiResult = '';
    this.category = '';
  }
}