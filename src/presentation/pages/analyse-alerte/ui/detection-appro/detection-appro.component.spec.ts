/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DetectionApproComponent } from './detection-appro.component';

describe('DetectionApproComponent', () => {
    let component: DetectionApproComponent;
    let fixture: ComponentFixture<DetectionApproComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DetectionApproComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DetectionApproComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
