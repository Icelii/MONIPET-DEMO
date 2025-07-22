import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptionAppointmentDetailComponent } from './adoption-appointment-detail.component';

describe('AdoptionAppointmentDetailComponent', () => {
  let component: AdoptionAppointmentDetailComponent;
  let fixture: ComponentFixture<AdoptionAppointmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptionAppointmentDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptionAppointmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
