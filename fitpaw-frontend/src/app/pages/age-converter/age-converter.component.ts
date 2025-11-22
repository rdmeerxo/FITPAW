import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-age-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './age-converter.component.html',
  styleUrl: './age-converter.component.css'
})
export class AgeConverterComponent {
  petName: string = '';
  gender: string = '';
  inputType: string = 'birthdate';
  birthdate: string = '';
  age: number = 0;
  ageUnit: string = 'years';
  
  showResults: boolean = false;
  resultText: string = '';
  resultImage: string = '';

  calculateAge() {
    if (!this.petName) {
      alert('Please enter your pet\'s name');
      return;
    }

    if (!this.gender) {
      alert('Please select a gender');
      return;
    }

    let catAgeInYears = 0;
    let catAgeInMonths = 0;
    let zodiacSign = '';

    //computing age based on input type
    if (this.inputType === 'birthdate' && this.birthdate) {
      const birth = new Date(this.birthdate);
      const today = new Date();
      
      //calculating age
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      let days = today.getDate() - birth.getDate();

      if (days < 0) {
        months--;
      }


      if (months < 0) {
        years--;
        months += 12;
      }
      
      catAgeInYears = years;
      catAgeInMonths = (years * 12) + months;
      
      //zodiac sign
      zodiacSign = this.getZodiacSign(birth.getMonth() + 1, birth.getDate());
    } else if (this.inputType === 'age' && this.age > 0) {
      catAgeInMonths = this.ageUnit === 'years' ? this.age * 12 : this.age;
      catAgeInYears = catAgeInMonths / 12;
    } else {
      alert('Please enter valid age information');
      return;
    }

    //cat age to human age
    const humanAge = this.convertToHumanAge(catAgeInYears);
    
    //result text
    const pronoun = this.gender === 'boy' ? "He's" : "She's";
    this.resultText = `${this.petName} is ${humanAge} years old in human years!`;
  
    
    //only show zodiac if it was calculated (birthdate was used)
    if (zodiacSign) {
      this.resultText += ` Aaaaand a smart ${zodiacSign}! :)`;
    }
    
    //show image based on age and gender
    this.resultImage = this.getResultImage(catAgeInMonths);

    console.log('Cat age in months:', catAgeInMonths);
    console.log('Result image:', this.resultImage); 

    this.showResults = true;
  }

  convertToHumanAge(catAge: number): number {
    if (catAge < 1) {
      //kittens (1 to 11 months)
      return Math.round(catAge * 15);
    } else if (catAge === 1) {
      return 15;
    } else if (catAge === 2) {
      return 24;
    } else if (catAge === 3) {
      return 28;
    } else if (catAge >= 18) {
      return 88;
    } else {
      //ages 4-17: 28 + (age - 3) * 4
      return 28 + Math.round((catAge - 3) * 4);
    }
  }

  getZodiacSign(month: number, day: number): string {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    return '';
  }

  //images for each age group XD
 getResultImage(catAgeInMonths: number): string {

  if (catAgeInMonths < 1) {
    catAgeInMonths = 1;
  }

  if (catAgeInMonths === 1) {
    //1 month = 1year human
    return this.gender === 'boy' ? 'assets/babycat.png' : 'assets/babycat.png';
  } else if (catAgeInMonths >= 2 && catAgeInMonths <= 4) {
    // 2-4 months = 3years old human
    return this.gender === 'boy' ? 'assets/3yearsboy.png' : 'assets/3yearsgirl.png';
  } else if (catAgeInMonths === 5) {
    // 5 months = 6 years old(schoolday)
    return this.gender === 'boy' ? 'assets/6yearsboy.png' : 'assets/6yearsgirl.png';
  } else if (catAgeInMonths >= 6 && catAgeInMonths <= 8) {
    // 6-8 months = teenage beginning
    return this.gender === 'boy' ? 'assets/teencatboy.png' : 'assets/teencatgirl.png';
  } else if (catAgeInMonths >= 9 && catAgeInMonths <= 11) {
    // 9-11 months = teenagers
    return this.gender === 'boy' ? 'assets/teenageboy.png' : 'assets/teenagegirl.png';
  } else if (catAgeInMonths >= 12 && catAgeInMonths < 24) {
    // 1 year= teen old
    return this.gender === 'boy' ? 'assets/teenboy.png' : 'assets/teengirl.png';
  } else if (catAgeInMonths >= 24 && catAgeInMonths < 36) {
    // 2 years=adult studying
    return this.gender === 'boy' ? 'assets/studygirl.png' : 'assets/studygirl.png';
  } else if (catAgeInMonths >= 36 && catAgeInMonths < 120) {
    // 3-9years=adult working
    return this.gender === 'boy' ? 'assets/adulttboy.png' : 'assets/adultgirl.png';
  } else {
    // 10+ years=seniors
    return this.gender === 'boy' ? 'assets/oldboy.png' : 'assets/oldgirl.png';
  }
}

  clearForm() {
    this.petName = '';
    this.gender = ''; 
    this.inputType = 'birthdate';
    this.birthdate = '';
    this.age = 0;
    this.ageUnit = 'years';
    this.showResults = false;
    this.resultText = '';
    this.resultImage = '';
  }
}