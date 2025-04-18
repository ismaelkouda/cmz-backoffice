/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConnexionFormComponent } from './connexion-form.component';

describe('ConnexionFormComponent', () => {
    let component: ConnexionFormComponent;
    let fixture: ComponentFixture<ConnexionFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConnexionFormComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnexionFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
