import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentServiceCardComponent } from './appointment-service-card.component';

describe('AppointmentServiceCardComponent', () => {
  let component: AppointmentServiceCardComponent;
  let fixture: ComponentFixture<AppointmentServiceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentServiceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentServiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
