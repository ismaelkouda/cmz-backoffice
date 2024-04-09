/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardStockComponent } from './card-stock.component';

describe('CardStockComponent', () => {
  let component: CardStockComponent;
  let fixture: ComponentFixture<CardStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
