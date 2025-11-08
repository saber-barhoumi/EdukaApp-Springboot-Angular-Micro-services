import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlivreComponent } from './editlivre.component';

describe('EditlivreComponent', () => {
  let component: EditlivreComponent;
  let fixture: ComponentFixture<EditlivreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditlivreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditlivreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
