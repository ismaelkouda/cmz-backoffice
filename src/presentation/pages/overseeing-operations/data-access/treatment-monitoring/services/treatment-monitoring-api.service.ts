import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { treatmentMonitoringApiResponseInterface } from '../interfaces/treatment-monitoring.interface';
import { treatmentMonitoringEndpointEnum } from '../enums/treatment-monitoring-endpoint.enum';
import { treatmentMonitoringFilterInterface } from '../interfaces/treatment-monitoring-filter.interface';
import { Folder } from '../../../../../../shared/interfaces/folder';

@Injectable()

export class TreatmentMonitoringApiService {
    private treatmentMonitoringSubject = new BehaviorSubject<Array<Folder>>([]);
    private treatmentMonitoringPagination = new BehaviorSubject<Paginate<Folder>>({} as Paginate<Folder>);
    private treatmentMonitoringSelected = new BehaviorSubject<Folder>({} as Folder);
    private loadingTreatmentMonitoringSubject = new BehaviorSubject<boolean>(false);
    private dataFilterTreatmentMonitoringSubject = new BehaviorSubject<treatmentMonitoringFilterInterface>({} as treatmentMonitoringFilterInterface);
    private dataNbrPageTreatmentMonitoringSubject = new BehaviorSubject<string>('1');
    private apiResponseTreatmentMonitoringSubject = new BehaviorSubject<treatmentMonitoringApiResponseInterface>({} as treatmentMonitoringApiResponseInterface);

    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste treatment-monitoring*************** */
    fetchTreatmentMonitoring(data: treatmentMonitoringFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingTreatmentMonitoringSubject.getValue()) return;
        this.loadingTreatmentMonitoringSubject.next(true);
        const url: string = treatmentMonitoringEndpointEnum.SUPERVISION_OPERATIONS_TRAITEMENTS_SUIVIS_DEMANDES_SERVICES_PAGE.replace('{page}', nbrPage);

        this.http
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const treatmentMonitoring = response?.['data']?.data.map((demande) => {
                        return { ...demande, demandeur: demande.demandeur_nom + " " + demande.demandeur_prenoms };
                    });
                    this.treatmentMonitoringSubject.next(treatmentMonitoring);
                    this.treatmentMonitoringPagination.next(response?.['data']);
                    this.apiResponseTreatmentMonitoringSubject.next(response);
                    this.dataFilterTreatmentMonitoringSubject.next(data);
                    this.dataNbrPageTreatmentMonitoringSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching treatmentMonitoring', error);
                    return of([]);
                }),
                finalize(() => this.loadingTreatmentMonitoringSubject.next(false))
            )
            .subscribe();
    }

    getTreatmentMonitoring(): Observable<Array<Folder>> {
        return this.treatmentMonitoringSubject.asObservable();
    }
    getTreatmentMonitoringPagination(): Observable<Paginate<Folder>> {
        return this.treatmentMonitoringPagination.asObservable();
    }
    isLoadingTreatmentMonitoring(): Observable<boolean> {
        return this.loadingTreatmentMonitoringSubject.asObservable();
    }
    getDataFilterTreatmentMonitoring(): Observable<treatmentMonitoringFilterInterface> {
        return this.dataFilterTreatmentMonitoringSubject.asObservable();
    }
    getDataNbrPageTreatmentMonitoring(): Observable<string> {
        return this.dataNbrPageTreatmentMonitoringSubject.asObservable();
    }
    getApiResponseTreatmentMonitoring(): Observable<treatmentMonitoringApiResponseInterface> {
        return this.apiResponseTreatmentMonitoringSubject.asObservable();
    }
    getTreatmentMonitoringSelected(): Observable<Folder> {
        return this.treatmentMonitoringSelected.asObservable();
    }
    setTreatmentMonitoringSelected(treatmentMonitoring: Folder): void {
        this.treatmentMonitoringSelected.next(treatmentMonitoring);
    }
}
