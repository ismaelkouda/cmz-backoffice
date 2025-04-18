/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EtatsServicesComponent } from './etats-services.component';

describe('EtatsServicesComponent', () => {
    let component: EtatsServicesComponent;
    let fixture: ComponentFixture<EtatsServicesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EtatsServicesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EtatsServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
