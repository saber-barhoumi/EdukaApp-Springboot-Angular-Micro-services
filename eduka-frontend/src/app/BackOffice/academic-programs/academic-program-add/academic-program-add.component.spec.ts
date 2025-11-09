import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicProgramAddComponent } from './academic-program-add.component';

describe('AcademicProgramAddComponent', () => {
  let component: AcademicProgramAddComponent;
  let fixture: ComponentFixture<AcademicProgramAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicProgramAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicProgramAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
