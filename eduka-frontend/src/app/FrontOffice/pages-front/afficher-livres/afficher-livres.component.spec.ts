import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherLivresComponent } from './afficher-livres.component';

describe('AfficherLivresComponent', () => {
  let component: AfficherLivresComponent;
  let fixture: ComponentFixture<AfficherLivresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherLivresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherLivresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
