import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgsSearchComponent } from './imgs-search.component';

describe('ImgsSearchComponent', () => {
  let component: ImgsSearchComponent;
  let fixture: ComponentFixture<ImgsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgsSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
