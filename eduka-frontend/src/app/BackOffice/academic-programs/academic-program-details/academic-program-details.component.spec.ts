import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicProgramDetailsComponent } from './academic-program-details.component';

describe('AcademicProgramDetailsComponent', () => {
  let component: AcademicProgramDetailsComponent;
  let fixture: ComponentFixture<AcademicProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicProgramDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
