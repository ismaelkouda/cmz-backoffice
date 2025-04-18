/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SoldesSimComponent } from './soldes-sim.component';

describe('SoldesSimComponent', () => {
    let component: SoldesSimComponent;
    let fixture: ComponentFixture<SoldesSimComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SoldesSimComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SoldesSimComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
