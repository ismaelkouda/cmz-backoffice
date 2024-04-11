/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StockProduitComponent } from './stock-produit.component';

describe('StockProduitComponent', () => {
  let component: StockProduitComponent;
  let fixture: ComponentFixture<StockProduitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockProduitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
