import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CalculatorService } from '../../services/calculator.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: any = null;
  cats: any[] = [];
  selectedCat: any = null;
  logs: any[] = [];

  // Add cat form
  showAddCat = false;
  newCatName = '';
  newCatDob = '';
  newCatNeutered = false;
  addCatError = '';

  // Log weight form
  showLogWeight = false;
  newWeight: number | null = null;
  newRibCirc: number | null = null;
  newLegLength: number | null = null;
  logError = '';

  isLoadingCats = true;
  isLoadingLogs = false;
  isSaving = false;

  constructor(
    private authService: AuthService,
    private calculatorService: CalculatorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadCats();
  }

  loadCats() {
    this.isLoadingCats = true;
    this.calculatorService.getCats().subscribe({
      next: (cats) => {
        this.cats = cats;
        this.isLoadingCats = false;
        if (cats.length > 0) this.selectCat(cats[0]);
      },
      error: () => {
        this.isLoadingCats = false;
      }
    });
  }

  selectCat(cat: any) {
    this.selectedCat = cat;
    this.showLogWeight = false;
    this.loadLogs(cat.id);
  }

  loadLogs(catId: number) {
    this.isLoadingLogs = true;
    this.calculatorService.getLogs(catId).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.isLoadingLogs = false;
      },
      error: () => { this.isLoadingLogs = false; }
    });
  }

  // ── Add cat ──────────────────────────────────────────
  submitAddCat() {
    this.addCatError = '';
    if (!this.newCatName.trim()) {
      this.addCatError = 'Please enter a cat name.';
      return;
    }
    this.isSaving = true;
    this.calculatorService.createCat({
      name: this.newCatName.trim(),
      date_of_birth: this.newCatDob || null,
      neuter_status: this.newCatNeutered
    }).subscribe({
      next: (cat) => {
        this.cats.push(cat);
        this.selectCat(cat);
        this.showAddCat = false;
        this.newCatName = '';
        this.newCatDob = '';
        this.newCatNeutered = false;
        this.isSaving = false;
      },
      error: (err) => {
        this.addCatError = err.error?.error?.message || 'Could not add cat.';
        this.isSaving = false;
      }
    });
  }

  // ── Log weight ────────────────────────────────────────
  submitLog() {
    this.logError = '';
    if (!this.newWeight || this.newWeight <= 0) {
      this.logError = 'Please enter a valid weight.';
      return;
    }

    // calculate FBMI locally if measurements provided
    let fbmi = null;
    if (this.newRibCirc && this.newLegLength) {
      const rc = this.newRibCirc;
      const lim = this.newLegLength;
      fbmi = parseFloat((((rc / 0.7067) - lim) / 0.9156 - lim).toFixed(2));
    }

    this.isSaving = true;
    this.calculatorService.addLog(this.selectedCat.id, {
      weight_kg: this.newWeight,
      rib_circumference: this.newRibCirc || null,
      leg_length: this.newLegLength || null,
      fbmi
    }).subscribe({
      next: (log) => {
        this.logs.unshift(log); // add to top
        this.showLogWeight = false;
        this.newWeight = null;
        this.newRibCirc = null;
        this.newLegLength = null;
        this.isSaving = false;
      },
      error: (err) => {
        this.logError = err.error?.error?.message || 'Could not save log.';
        this.isSaving = false;
      }
    });
  }

  deleteLog(logId: number) {
    this.calculatorService.deleteLog(this.selectedCat.id, logId).subscribe({
      next: () => {
        this.logs = this.logs.filter(l => l.id !== logId);
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  // ── Helpers ───────────────────────────────────────────
  get latestLog() {
    return this.logs.length > 0 ? this.logs[0] : null;
  }

  get fbmiCategory(): string {
    if (!this.latestLog?.fbmi) return '';
    const f = this.latestLog.fbmi;
    if (f < 15) return 'Underweight';
    if (f < 30) return 'Normal';
    if (f <= 42) return 'Overweight';
    return 'Obese';
  }

  get fbmiClass(): string {
    if (!this.latestLog?.fbmi) return '';
    const f = this.latestLog.fbmi;
    if (f < 15) return 'badge-warn';
    if (f < 30) return 'badge-ok';
    if (f <= 42) return 'badge-warn';
    return 'badge-alert';
  }

  catAge(dob: string): string {
    if (!dob) return 'Unknown age';
    const birth = new Date(dob);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    const totalMonths = years * 12 + months;
    if (totalMonths < 12) return `${totalMonths} months old`;
    return `${years} year${years > 1 ? 's' : ''} old`;
  }

  weightTrend(index: number): string {
    if (index >= this.logs.length - 1) return '';
    const diff = this.logs[index].weight_kg - this.logs[index + 1].weight_kg;
    if (Math.abs(diff) < 0.05) return '→';
    return diff < 0 ? `↓ ${Math.abs(diff).toFixed(2)}` : `↑ ${Math.abs(diff).toFixed(2)}`;
  }

  weightTrendClass(index: number): string {
    if (index >= this.logs.length - 1) return '';
    const diff = this.logs[index].weight_kg - this.logs[index + 1].weight_kg;
    if (Math.abs(diff) < 0.05) return 'trend-flat';
    return diff < 0 ? 'trend-down' : 'trend-up';
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
