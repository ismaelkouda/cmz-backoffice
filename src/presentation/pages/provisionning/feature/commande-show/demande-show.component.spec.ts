/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommandeShowComponent } from './commande-show.component';

describe('DemandeShowComponent', () => {
    let component: CommandeShowComponent;
    let fixture: ComponentFixture<CommandeShowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommandeShowComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommandeShowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
