/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DemandeSuspensionComponent } from './demande-suspension.component';

describe('DemandeSuspensionComponent', () => {
    let component: DemandeSuspensionComponent;
    let fixture: ComponentFixture<DemandeSuspensionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DemandeSuspensionComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DemandeSuspensionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
