/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SeuilAlarmesComponent } from './seuil-alarmes.component';

describe('SeuilAlarmesComponent', () => {
    let component: SeuilAlarmesComponent;
    let fixture: ComponentFixture<SeuilAlarmesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SeuilAlarmesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SeuilAlarmesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
