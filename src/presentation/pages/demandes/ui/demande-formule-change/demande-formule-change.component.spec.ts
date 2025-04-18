/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DemandeFormuleChangeComponent } from './demande-formule-change.component';

describe('DemandeFormuleChangeComponent', () => {
    let component: DemandeFormuleChangeComponent;
    let fixture: ComponentFixture<DemandeFormuleChangeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DemandeFormuleChangeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DemandeFormuleChangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
