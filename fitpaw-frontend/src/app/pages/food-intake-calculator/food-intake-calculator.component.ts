import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalculatorService } from '../../services/calculator.service';
import { Html5Qrcode } from 'html5-qrcode';

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

  html5QrCode: Html5Qrcode | null = null;
  isScannerActive: boolean = false;
  currentScanningIndex: number = -1;
  manualBarcode: string = '';

  constructor(private calculatorService: CalculatorService) {}

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
    this.currentScanningIndex = index;
    this.isScannerActive = true;
    
    // Start scanner after a brief delay to let the modal/element render
    setTimeout(() => {
      this.startScanner();
    }, 100);
  }

  async startScanner() {
    try {
      this.html5QrCode = new Html5Qrcode("barcode-reader");
      
      await this.html5QrCode.start(
        { 
          facingMode: "environment" //backcamera
        },
        {
          fps: 10,
          qrbox: { width: 250, height: 80 },
          aspectRatio: 2.5,
          disableFlip: false
        },
        (decodedText) => {
          // Success! Got barcode :P
          this.onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // scan errors (can ignore)
        }
      );
    } catch (err) {
      console.error("Failed to start scanner:", err);
      alert("Could not access camera. Please check permissions or enter barcode manually.");
      this.stopScanner();
    }
  }

  onScanSuccess(barcode: string) {
    console.log("Step 1: Scanned barcode:", barcode);


    //saving the index before stopping scanner in order to automatically fill
    //the input box T_T
    const foodIndex = this.currentScanningIndex;
  
    //stop
    this.stopScanner();
    console.log("Step 2: Scanner stopped");
  
    //fetching food data from backend
    console.log("Step 3: About to call backend API...");
    console.log("Step 4: API URL will be:", `http://192.168.0.108:3001/api/food/lookup/${barcode}`);
  
    this.calculatorService.lookupFoodByBarcode(barcode).subscribe({
      next: (response) => {
        console.log("Step 5: SUCCESS! Food data:", response);
        console.log("Saved food index:", foodIndex);
        
        // updaate the food entry
        if (foodIndex >= 0 && foodIndex < this.foods.length) {
          this.foods[foodIndex].name = response.productName;
          this.foods[foodIndex].caloriesPer100g = response.energyKcalPer100g || 0;
          console.log("Updated food:", this.foods[foodIndex]);
        }
        
        alert(`Found: ${response.productName}\nCalories: ${response.energyKcalPer100g} kcal/100g`);
      },
      error: (error) => {
        console.error("Step 5: ERROR!", error);
        alert("Could not find product. Please enter calories manually.");
      }
    });
}

  stopScanner() {
    if (this.html5QrCode) {
      this.html5QrCode.stop().then(() => {
        this.html5QrCode = null;
        this.isScannerActive = false;
        this.currentScanningIndex = -1;
      }).catch((err) => {
        console.error("Error stopping scanner:", err);
        this.isScannerActive = false;
        this.currentScanningIndex = -1;
      });
    } else {
      this.isScannerActive = false;
      this.currentScanningIndex = -1;
    }
  }

  lookupManualBarcode(index: number) {
    if (!this.manualBarcode || this.manualBarcode.length < 6) {
      alert('Please enter a valid barcode (minimum 6 digits)');
      return;
    }
    
    this.currentScanningIndex = index;
    this.onScanSuccess(this.manualBarcode);
    this.manualBarcode = ''; //clearing after lookup
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