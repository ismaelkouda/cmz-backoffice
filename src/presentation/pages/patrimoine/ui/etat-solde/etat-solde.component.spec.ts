/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EtatSoldeComponent } from './etat-solde.component';

describe('EtatSoldeComponent', () => {
    let component: EtatSoldeComponent;
    let fixture: ComponentFixture<EtatSoldeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EtatSoldeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EtatSoldeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
