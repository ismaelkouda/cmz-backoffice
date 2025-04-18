/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DemandeWrapperComponent } from './demande-wrapper.component';

describe('DemandeWrapperComponent', () => {
    let component: DemandeWrapperComponent;
    let fixture: ComponentFixture<DemandeWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DemandeWrapperComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DemandeWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
