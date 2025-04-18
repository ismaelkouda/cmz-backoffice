/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StatutContratComponent } from './statut-contrat.component';

describe('StatutContratComponent', () => {
    let component: StatutContratComponent;
    let fixture: ComponentFixture<StatutContratComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StatutContratComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatutContratComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
