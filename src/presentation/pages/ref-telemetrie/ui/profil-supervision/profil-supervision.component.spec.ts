/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfilSupervisionComponent } from './profil-supervision.component';

describe('ProfilSupervisionComponent', () => {
    let component: ProfilSupervisionComponent;
    let fixture: ComponentFixture<ProfilSupervisionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProfilSupervisionComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfilSupervisionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
