/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfilHabilitationComponent } from './profil-habilitation.component';

describe('ProfilHabilitationComponent', () => {
    let component: ProfilHabilitationComponent;
    let fixture: ComponentFixture<ProfilHabilitationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProfilHabilitationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfilHabilitationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
