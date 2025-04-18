/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AchatsComponent } from './achats.component';

describe('AchatsComponent', () => {
    let component: AchatsComponent;
    let fixture: ComponentFixture<AchatsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AchatsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AchatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
