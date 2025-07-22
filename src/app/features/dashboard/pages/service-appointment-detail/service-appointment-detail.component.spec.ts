import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAppointmentDetailComponent } from './service-appointment-detail.component';

describe('ServiceAppointmentDetailComponent', () => {
  let component: ServiceAppointmentDetailComponent;
  let fixture: ComponentFixture<ServiceAppointmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAppointmentDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAppointmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
