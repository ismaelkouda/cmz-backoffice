/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PriseEnChargeComponent } from './prise-en-charge.component';

describe('PriseEnChargeComponent', () => {
    let component: PriseEnChargeComponent;
    let fixture: ComponentFixture<PriseEnChargeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PriseEnChargeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PriseEnChargeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
