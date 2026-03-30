import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { FbmiCalculatorComponent } from './pages/fbmi-calculator/fbmi-calculator.component';
import { CalorieCalculatorComponent } from './pages/calorie-calculator/calorie-calculator.component';
import { FoodIntakeCalculatorComponent } from './pages/food-intake-calculator/food-intake-calculator.component';
import { AgeConverterComponent } from './pages/age-converter/age-converter.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent, data: { animation: 'LandingPage' } },
  { path: 'fbmi', component: FbmiCalculatorComponent, data: { animation: 'FbmiPage' } },
  { path: 'calorie', component: CalorieCalculatorComponent, data: { animation: 'CaloriePage' } },
  { path: 'food-intake', component: FoodIntakeCalculatorComponent, data: { animation: 'FoodIntakePage' } },
  { path: 'age-converter', component: AgeConverterComponent, data: { animation: 'AgeConverterPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { animation: 'DashboardPage' } },
  { path: '**', redirectTo: '' }
];
