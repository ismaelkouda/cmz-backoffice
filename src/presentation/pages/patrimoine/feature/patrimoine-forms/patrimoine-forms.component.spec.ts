/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PatrimoineFormsComponent } from './patrimoine-forms.component';

describe('PatrimoineFormsComponent', () => {
    let component: PatrimoineFormsComponent;
    let fixture: ComponentFixture<PatrimoineFormsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PatrimoineFormsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PatrimoineFormsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
