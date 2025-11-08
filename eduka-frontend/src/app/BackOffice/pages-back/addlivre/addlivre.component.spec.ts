import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlivreComponent } from './addlivre.component';

describe('AddlivreComponent', () => {
  let component: AddlivreComponent;
  let fixture: ComponentFixture<AddlivreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddlivreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddlivreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
