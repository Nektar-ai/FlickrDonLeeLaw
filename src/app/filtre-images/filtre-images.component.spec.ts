import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreImagesComponent } from './filtre-images.component';

describe('FiltreImagesComponent', () => {
  let component: FiltreImagesComponent;
  let fixture: ComponentFixture<FiltreImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltreImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltreImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
