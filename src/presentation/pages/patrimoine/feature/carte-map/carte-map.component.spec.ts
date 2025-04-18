/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CarteMapComponent } from './carte-map.component';

describe('CarteMapComponent', () => {
    let component: CarteMapComponent;
    let fixture: ComponentFixture<CarteMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CarteMapComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarteMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
