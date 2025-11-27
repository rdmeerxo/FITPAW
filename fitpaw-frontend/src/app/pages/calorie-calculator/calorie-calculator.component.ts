import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalculatorService } from '../../services/calculator.service'; // ADD THIS

@Component({
  selector: 'app-calorie-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './calorie-calculator.component.html',
  styleUrl: './calorie-calculator.component.css'
})
export class CalorieCalculatorComponent {
  
  constructor(private calculatorService: CalculatorService) {} // ADD THIS
  
  weight: number | null = null;
  isNeutered: boolean = true;
  age: number | null = null;
  ageUnit: string = 'years';
  weightGoal: string = 'na';
  
  showResults: boolean = false;
  totalCalories: string = '';
  weightLossCalories: string = '';
  weightGainCalories: string = '';

  calculateCalories() {
    if (this.weight != null && this.age != null && this.weight > 0 && this.age >= 0) {
      // converting age to years for backend
      const ageInYears = this.ageUnit === 'years' ? this.age : this.age / 12;
      
      //map weight goal to backend format
      let goalParam = 'none';
      if (this.weightGoal === 'loss') goalParam = 'weight_loss';
      else if (this.weightGoal === 'gain') goalParam = 'weight_gain';
      
      const data = {
        weightKg: Number(this.weight),
        neutered: this.isNeutered,
        age: Number(ageInYears),
        goal: goalParam
      };
      
      //call backend API, helloooo
      this.calculatorService.calculateCalories(data).subscribe({
        next: (response) => {
          this.totalCalories = response.caloriesPerDay.toString();
          this.weightLossCalories = response.weightLossCalories.toString();
          this.weightGainCalories = response.weightGainCalories.toString();
          this.showResults = true;
          
          // saving the appropriate calories based on weight goal
          let caloriesToSave = response.caloriesPerDay;
          
          if (this.weightGoal === 'loss') {
            caloriesToSave = response.weightLossCalories;
          } else if (this.weightGoal === 'gain') {
            caloriesToSave = response.weightGainCalories;
          }
          
          // save for food intake calculator
          localStorage.setItem('lastRER', caloriesToSave.toString());
          console.log('Saved to localStorage:', caloriesToSave); // Debug
        },
        error: (error) => {
          console.error('Error calculating calories:', error);
          alert('Error calculating calories. Please try again.');
          this.showResults = false;
        }
      });
    } else {
      this.showResults = false;
    }
  }

  clearForm() {
    this.weight = null;
    this.isNeutered = true;
    this.age = null;
    this.ageUnit = 'years';
    this.weightGoal = 'na';
    this.showResults = false;
    this.totalCalories = '';
    this.weightLossCalories = '';
    this.weightGainCalories = '';
  }
}