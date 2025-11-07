import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { EnvService } from '../../../../../../shared/services/env.service';
import { SlaContactsEndpointEnum } from '../enums/sla-contacts-endpoint.enum';
import {
    SLA_CONTACTS_FORM_MODE_ENUM,
    T_SLA_CONTACTS_FORM_MODE_ENUM,
} from '../enums/sla-contacts-form-mode.enum';
import {
    SlaContactsApiResponseInterface,
    SlaContactsInterface,
} from '../interfaces/sla-contacts.interface';

@Injectable()
export class SlaContactsApiService {
    private BASE_URL: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.reportUrl;
    }

    private slaContactsSubject = new BehaviorSubject<SlaContactsInterface>(
        {} as SlaContactsInterface
    );
    private loadingSlaContactsSubject = new BehaviorSubject<boolean>(false);
    private apiResponseSlaContactsSubject =
        new BehaviorSubject<SlaContactsApiResponseInterface>(
            {} as SlaContactsApiResponseInterface
        );
    private slaContactsFormModeSubject =
        new BehaviorSubject<T_SLA_CONTACTS_FORM_MODE_ENUM>(
            SLA_CONTACTS_FORM_MODE_ENUM.EDIT as T_SLA_CONTACTS_FORM_MODE_ENUM
        );
    fetchSlaContacts(): void {
        if (this.loadingSlaContactsSubject.getValue()) return;
        this.loadingSlaContactsSubject.next(true);
        const url: string =
            SlaContactsEndpointEnum.SUPERVISORY_REFERENCE_SLA_CONTACTS;

        this.httpClient
            .post<Object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const slaContacts = response?.['data'];
                    this.slaContactsSubject.next(slaContacts);
                    this.apiResponseSlaContactsSubject.next(response);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching sim-card', error);
                    return of([]);
                }),
                finalize(() => this.loadingSlaContactsSubject.next(false))
            )
            .subscribe();
    }

    getSlaContacts(): Observable<SlaContactsInterface> {
        return this.slaContactsSubject.asObservable();
    }
    isLoadingSlaContacts(): Observable<boolean> {
        return this.loadingSlaContactsSubject.asObservable();
    }
    getApiResponseSlaContacts(): Observable<SlaContactsApiResponseInterface> {
        return this.apiResponseSlaContactsSubject.asObservable();
    }
    setSlaContactsFormMode(
        slaContactsFormMode: T_SLA_CONTACTS_FORM_MODE_ENUM
    ): void {
        this.slaContactsFormModeSubject.next(slaContactsFormMode);
    }
    getSlaContactsFormMode(): Observable<T_SLA_CONTACTS_FORM_MODE_ENUM> {
        return this.slaContactsFormModeSubject.asObservable();
    }

    /*********************Méthode pour valider une creation de client *************** */

    private updateSlaContactsSubject = new BehaviorSubject<any>({} as any);
    private loadingUpdateSlaContactsSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchUpdateSlaContacts(
        data: any,
        toastService: ToastrService,
        goOut?: () => void
    ): void {
        if (this.loadingUpdateSlaContactsSubject.getValue()) return;
        this.loadingUpdateSlaContactsSubject.next(true);
        const url: string =
            SlaContactsEndpointEnum.SUPERVISORY_REFERENCE_SLA_CONTACTS_UPDATE;
        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const updateSlaContacts = response;
                    this.updateSlaContactsSubject.next(updateSlaContacts);
                    this.handleSuccessFullFetch(response, toastService, goOut);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching updateSlaContacts', error);
                    return of([]);
                }),
                finalize(() => this.loadingUpdateSlaContactsSubject.next(false))
            )
            .subscribe();
    }

    getUpdateSlaContacts(): Observable<any> {
        return this.updateSlaContactsSubject.asObservable();
    }
    isLoadingUpdateSlaContacts(): Observable<boolean> {
        return this.loadingUpdateSlaContactsSubject.asObservable();
    }

    handleSuccessFullFetch(
        response: any,
        toastService: ToastrService,
        goOut?: () => void
    ) {
        if (response && response.error === false && toastService) {
            toastService.success(response.message);
            if (goOut) {
                goOut();
            }
            this.fetchSlaContacts();
        } else if (response && response.error === true) {
            toastService.error(response.message);
        }
    }
}
