/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StatutDemandeComponent } from './statut-demande.component';

describe('StatutDemandeComponent', () => {
    let component: StatutDemandeComponent;
    let fixture: ComponentFixture<StatutDemandeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StatutDemandeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatutDemandeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
