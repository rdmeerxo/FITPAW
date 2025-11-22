import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodIntakeCalculatorComponent } from './food-intake-calculator.component';

describe('FoodIntakeCalculatorComponent', () => {
  let component: FoodIntakeCalculatorComponent;
  let fixture: ComponentFixture<FoodIntakeCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodIntakeCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodIntakeCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
