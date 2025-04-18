/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HistoriqueLifecycleComponent } from './historique-lifecycle.component';

describe('HistoriqueLifecycleComponent', () => {
    let component: HistoriqueLifecycleComponent;
    let fixture: ComponentFixture<HistoriqueLifecycleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HistoriqueLifecycleComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HistoriqueLifecycleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
