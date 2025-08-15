import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderElementsComponent } from './loader-elements.component';

describe('LoaderElementsComponent', () => {
  let component: LoaderElementsComponent;
  let fixture: ComponentFixture<LoaderElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderElementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
