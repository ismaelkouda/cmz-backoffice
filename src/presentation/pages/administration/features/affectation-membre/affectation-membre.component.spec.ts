/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AffectationMembreComponent } from './affectation-membre.component';

describe('AffectationMembreComponent', () => {
    let component: AffectationMembreComponent;
    let fixture: ComponentFixture<AffectationMembreComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AffectationMembreComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AffectationMembreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
