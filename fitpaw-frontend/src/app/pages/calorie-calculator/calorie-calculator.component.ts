import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-calorie-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './calorie-calculator.component.html',
  styleUrl: './calorie-calculator.component.css'
})
export class CalorieCalculatorComponent {
  weight: number = 0;
  isNeutered: boolean = true;
  age: number = 0;
  ageUnit: string = 'years';
  weightGoal: string = 'na';
  
  showResults: boolean = false;
  totalCalories: string = '';
  weightLossCalories: string = '';
  weightGainCalories: string = '';

  calculateCalories() {
    if (this.weight > 0 && this.age >= 0) {
      //RERformula --> 70 × (Weight)^0.75
      const rer = 70 * Math.pow(this.weight, 0.75);
      
      //age or months
      const ageInMonths = this.ageUnit === 'years' ? this.age * 12 : this.age;
      
      let dailyNeeds = 0;
      
      if (ageInMonths <= 4) {
        //kitten 0-4 monthsold
        dailyNeeds = 2.5 * rer;
      } else if (ageInMonths <= 12) {
        //kitten 4-12 months old
        dailyNeeds = 2 * rer;
      } else {
        //if not kitten, then considering neuter conditions for adults
        if (this.isNeutered) {
          dailyNeeds = 1.2 * rer;
        } else {
          dailyNeeds = 1.4 * rer;
        }
      }
      
      //any wight goal adjustments 
      const weightLoss = 0.8 * rer;
      const weightGain = 1.8 * rer;
      
      //showing results
      this.totalCalories = dailyNeeds.toFixed(0);
      this.weightLossCalories = weightLoss.toFixed(0);
      this.weightGainCalories = weightGain.toFixed(0);
      this.showResults = true;
    } else {
      this.showResults = false;
    }
  }

  clearForm() {
    this.weight = 0;
    this.isNeutered = true;
    this.age = 0;
    this.ageUnit = 'years';
    this.weightGoal = 'na';
    this.showResults = false;
    this.totalCalories = '';
    this.weightLossCalories = '';
    this.weightGainCalories = '';
  }
}