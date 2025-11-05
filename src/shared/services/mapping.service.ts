import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EncodingDataService } from './encoding-data.service';
import { EnvService } from './env.service';

export type AccessFeature = [
    'solde-data',
    'solde-sms',
    'identification',
    'activation',
];

@Injectable({
    providedIn: 'root',
})
export class MappingService {
    public profil: any;
    public structureGlobale: any;
    public logoTenant: any;
    public tenant: any;
    public grafanaLink: string;
    public rejetLink: string;
    public detectionApproUrl: string;
    public approLink: string;
    public sourceStockTenantSim: string;
    public sourceStockOrangeSim: string;
    public sourceSoldeDotation: string;
    public sourceSoldeDotationOrange: string;
    public _volumeDataGlobalSource: BehaviorSubject<string> =
        new BehaviorSubject('');
    public volumeDataGlobal$ = this._volumeDataGlobalSource.asObservable();
    public _ligneCreditSource: BehaviorSubject<string> = new BehaviorSubject(
        ''
    );
    public ligneCreditGlobal$ = this._ligneCreditSource.asObservable();
    public currentVariables: any;
    public analyseAlarmeNormales: any;
    public analyseAlarmeMineures: any;
    public analyseAlarmeMajeures: any;
    public analyseAlarmeCritiques: any;
    public analyseAlarmeGenerees: any;
    public getAccessFeature: AccessFeature;
    constructor(
        private encodingService: EncodingDataService,
        private http: HttpClient,
        private envService: EnvService
    ) {
        this.currentVariables = this.encodingService.getData('dashboard_links');
        this.grafanaLink = this.currentVariables?.dashboardGrafana;
        this.approLink = this.currentVariables?.dashboardAppro;
        this.detectionApproUrl = this.currentVariables?.dashboardAppro;
        this.rejetLink = this.tenant?.lien_dashboard_rejets;
        this.analyseAlarmeNormales =
            this.currentVariables?.analyseAlarmeNormales;
        this.analyseAlarmeMineures =
            this.currentVariables?.analyseAlarmeMineures;
        this.analyseAlarmeMajeures =
            this.currentVariables?.analyseAlarmeMajeures;
        this.analyseAlarmeCritiques =
            this.currentVariables?.analyseAlarmeCritiques;
        this.analyseAlarmeGenerees =
            this.currentVariables?.analyseAlarmeGenerees;
        this.getAccessFeature = this.currentVariables?.modules;
        this.sourceStockTenantSim =
            this.envService.messageApp.sourceStockTenantSim;
        this.sourceStockOrangeSim =
            this.envService.messageApp.sourceStockOrangeSim;
        this.sourceSoldeDotation =
            this.envService.messageApp.sourceSoldeDotation;
        this.sourceSoldeDotationOrange =
            this.envService.messageApp.sourceSoldeDotationOrange;

    }

    statutContrat(statut: string): any {
        switch (statut) {
            case 'actif': {
                return { 'badge-success': true };
            }
            case 'suspendu': {
                return { 'badge-danger': true };
            }
            default:
                return { 'badge-secondary': true };
        }
    }
}
