import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeConverterComponent } from './age-converter.component';

describe('AgeConverterComponent', () => {
  let component: AgeConverterComponent;
  let fixture: ComponentFixture<AgeConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeConverterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
