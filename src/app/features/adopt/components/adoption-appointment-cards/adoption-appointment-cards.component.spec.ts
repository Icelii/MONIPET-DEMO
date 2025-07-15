import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptionAppointmentCardsComponent } from './adoption-appointment-cards.component';

describe('AdoptionAppointmentCardsComponent', () => {
  let component: AdoptionAppointmentCardsComponent;
  let fixture: ComponentFixture<AdoptionAppointmentCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptionAppointmentCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptionAppointmentCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
