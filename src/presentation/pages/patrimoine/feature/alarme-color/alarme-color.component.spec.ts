/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AlarmeColorComponent } from './alarme-color.component';

describe('AlarmeColorComponent', () => {
    let component: AlarmeColorComponent;
    let fixture: ComponentFixture<AlarmeColorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlarmeColorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlarmeColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
