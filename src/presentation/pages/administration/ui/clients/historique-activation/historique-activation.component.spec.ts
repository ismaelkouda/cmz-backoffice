/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HistoriqueActivationComponent } from './historique-activation.component';

describe('HistoriqueActivationComponent', () => {
    let component: HistoriqueActivationComponent;
    let fixture: ComponentFixture<HistoriqueActivationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HistoriqueActivationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HistoriqueActivationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
