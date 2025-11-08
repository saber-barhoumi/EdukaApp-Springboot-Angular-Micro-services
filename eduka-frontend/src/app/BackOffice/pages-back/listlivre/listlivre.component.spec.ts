import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListlivreComponent } from './listlivre.component';

describe('ListlivreComponent', () => {
  let component: ListlivreComponent;
  let fixture: ComponentFixture<ListlivreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListlivreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListlivreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
