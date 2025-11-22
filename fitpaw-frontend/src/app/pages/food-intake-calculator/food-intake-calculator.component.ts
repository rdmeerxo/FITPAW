import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

interface Food {
  name: string;
  caloriesPer100g: number;
  percentage: number;
}

interface PortionResult {
  name: string;
  gramsPerDay: number;
  gramsPerMeal: number;
}

@Component({
  selector: 'app-food-intake-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './food-intake-calculator.component.html',
  styleUrl: './food-intake-calculator.component.css'
})
export class FoodIntakeCalculatorComponent implements OnInit {
  rer: number = 0;
  mealsPerDay: number = 2;
  foods: Food[] = [
    { name: '', caloriesPer100g: 0, percentage: 100 }
  ];
  
  showResults: boolean = false;
  portionResults: PortionResult[] = [];
  
  colors: string[] = ['#ebc2c2ff', '#4ECDC4', '#276370ff', '#FFA07A', '#98D8C8'];

  ngOnInit() {
    //loading RER value from localStorage if user came from calorie calculator
    const savedRER = localStorage.getItem('lastRER');
    if (savedRER) {
      this.rer = parseFloat(savedRER);
    }
  }

  addFood() {
    if (this.foods.length < 5) {
      const newPercentage = Math.floor(100 / (this.foods.length + 1));
      // Redistribute percentages
      this.foods.forEach(food => {
        food.percentage = newPercentage;
      });
      this.foods.push({ 
        name: '', 
        caloriesPer100g: 0, 
        percentage: newPercentage 
      });
    }
  }

  removeFood(index: number) {
    if (this.foods.length > 1) {
      this.foods.splice(index, 1);
      //redistributing percentages evenly
      const equalPercentage = Math.floor(100 / this.foods.length);
      this.foods.forEach((food, i) => {
        food.percentage = i === 0 ? 
          100 - (equalPercentage * (this.foods.length - 1)) : 
          equalPercentage;
      });
    }
  }

  adjustPercentages(changedIndex: number) {
    //making sure total percentages sum to 100
    let total = this.foods.reduce((sum, food) => sum + food.percentage, 0);
    
    if (total !== 100 && this.foods.length > 1) {
      const diff = total - 100;
      //distributing difference among other foods
      const othersCount = this.foods.length - 1;
      const adjustment = diff / othersCount;
      
      this.foods.forEach((food, i) => {
        if (i !== changedIndex) {
          food.percentage = Math.max(0, Math.min(100, food.percentage - adjustment));
        }
      });
    }
  }

  scanBarcode(index: number) {
    //barcode scanning with camera
    //for now, showing alert
    alert('Barcode scanning will be implemented with camera access and Open Food Facts API integration later. So for now, please enter manually hehe.');
  }

  calculateIntake() {
    if (this.rer <= 0 || this.mealsPerDay <= 0) {
      alert('Please enter valid RER and meals per day');
      return;
    }

    //check if all foods have valid data
    const validFoods = this.foods.filter(f => f.caloriesPer100g > 0);
    if (validFoods.length === 0) {
      alert('Please enter calories per 100g for at least one food');
      return;
    }

    this.portionResults = [];

    this.foods.forEach(food => {
      if (food.caloriesPer100g > 0) {
        // k_i = calories per gram
        const k_i = food.caloriesPer100g / 100;
        
        // c_i = total calories from this food
        const c_i = (food.percentage / 100) * this.rer;
        
        // x_i = grams per day
        const x_i = c_i / k_i;
        
        // grams per meal
        const gramsPerMeal = Math.round(x_i / this.mealsPerDay);
        
        this.portionResults.push({
          name: food.name || `Food ${this.foods.indexOf(food) + 1}`,
          gramsPerDay: Math.round(x_i),
          gramsPerMeal: gramsPerMeal
        });
      }
    });

    this.showResults = true;
    
    //saving RER to localStorage for potential reuse
    localStorage.setItem('lastRER', this.rer.toString());
  }

  clearForm() {
    this.rer = 0;
    this.mealsPerDay = 2;
    this.foods = [{ name: '', caloriesPer100g: 0, percentage: 100 }];
    this.showResults = false;
    this.portionResults = [];
  }

  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }
}