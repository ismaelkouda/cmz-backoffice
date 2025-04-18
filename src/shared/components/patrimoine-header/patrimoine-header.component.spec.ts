/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PatrimoineHeaderComponent } from './patrimoine-header.component';

describe('PatrimoineHeaderComponent', () => {
    let component: PatrimoineHeaderComponent;
    let fixture: ComponentFixture<PatrimoineHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PatrimoineHeaderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PatrimoineHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
