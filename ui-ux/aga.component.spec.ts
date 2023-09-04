import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgaComponent } from './aga.component';

describe('AgaComponent', () => {
  let component: AgaComponent;
  let fixture: ComponentFixture<AgaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgaComponent]
    });
    fixture = TestBed.createComponent(AgaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
