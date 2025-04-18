/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LigneShowComponent } from './ligne-show.component';

describe('DemandeShowComponent', () => {
    let component: LigneShowComponent;
    let fixture: ComponentFixture<LigneShowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LigneShowComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LigneShowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
