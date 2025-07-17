import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAppointmentCardComponent } from './service-appointment-card.component';

describe('ServiceAppointmentCardComponent', () => {
  let component: ServiceAppointmentCardComponent;
  let fixture: ComponentFixture<ServiceAppointmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAppointmentCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAppointmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
