import {
    SLA_CONTACTS_FORM_MODE_ENUM,
    T_SLA_CONTACTS_FORM_MODE_ENUM,
} from './../../data-access/sla-contacts/enums/sla-contacts-form-mode.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SlaContactsInterface } from '../../data-access/sla-contacts/interfaces/sla-contacts.interface';
import { SlaContactsApiService } from '../../data-access/sla-contacts/services/sla-contacts-api.service';

@Component({
    selector: 'app-sla-contacts',
    templateUrl: './sla-contacts.component.html',
    styleUrls: ['./sla-contacts.component.scss'],
})
export class SlaContactsComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public formMode: T_SLA_CONTACTS_FORM_MODE_ENUM;
    public slaContacts$: Observable<SlaContactsInterface>;
    public spinner: boolean = true;
    public tabPanelIndexActive: number = 0;
    public BUTTON_LABEL_FORM: {
        [key in T_SLA_CONTACTS_FORM_MODE_ENUM]: string;
    } = {
        [SLA_CONTACTS_FORM_MODE_ENUM.SEE]: 'Voir',
        [SLA_CONTACTS_FORM_MODE_ENUM.EDIT]: 'Modifier',
    };

    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private slaContactsApiService: SlaContactsApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.slaContacts$ = this.slaContactsApiService.getSlaContacts();
        this.slaContactsApiService.fetchSlaContacts();
        this.slaContactsApiService
            .isLoadingSlaContacts()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
        this.slaContactsApiService
            .getSlaContactsFormMode()
            .subscribe((formMode) => {
                this.formMode = formMode ?? SLA_CONTACTS_FORM_MODE_ENUM.EDIT;
            });
    }

    public handleChangeSlaContactsFormMode(): void {
        this.formMode =
            this.formMode === SLA_CONTACTS_FORM_MODE_ENUM.EDIT
                ? SLA_CONTACTS_FORM_MODE_ENUM.SEE
                : SLA_CONTACTS_FORM_MODE_ENUM.EDIT;

        this.slaContactsApiService.setSlaContactsFormMode(this.formMode);
    }

    public get disabledHistoryTabPanel(): boolean {
        this.tabPanelIndexActive = 0;
        return this.formMode === SLA_CONTACTS_FORM_MODE_ENUM.SEE;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
