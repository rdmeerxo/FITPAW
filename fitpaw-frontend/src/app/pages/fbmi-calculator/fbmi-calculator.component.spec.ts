import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbmiCalculatorComponent } from './fbmi-calculator.component';

describe('FbmiCalculatorComponent', () => {
  let component: FbmiCalculatorComponent;
  let fixture: ComponentFixture<FbmiCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FbmiCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FbmiCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
