import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicProgramEditComponent } from './academic-program-edit.component';

describe('AcademicProgramEditComponent', () => {
  let component: AcademicProgramEditComponent;
  let fixture: ComponentFixture<AcademicProgramEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicProgramEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicProgramEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
