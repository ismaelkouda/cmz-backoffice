import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';
import { Observable } from 'rxjs';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { EnvService } from '../../../../shared/services/env.service';

@Injectable({
    providedIn: 'root',
})
export class TelemetrieService {
    public baseUrl: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }

    GetAllReferentielTelemetrie(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_REFERENTIEL_TELEMETRIE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetMetriquesByProfil(id): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_METRIQUES_BY_PROFIL
        )).replace('{id}', id);
        return this.http.post(`${this.baseUrl}${url}`, {});
    }
    GetSmsMetriquesByProfil(id): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_SMS_METRIQUES_BY_PROFIL
        )).replace('{id}', id);
        return this.http.post(`${this.baseUrl}${url}`, {});
    }

    GetAllProfilSupervision(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_PROFILS_SUPERVISION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetAllPrevention(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_ALERT_PREVENTION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    handleActivateProfil(data): Observable<any> {
        const url: string = (<string>EndPointUrl.ACTIVATE_PROFIL).replace(
            '{id}',
            data
        );
        return this.http.put(`${this.baseUrl}${url}`, {});
    }
    handleDisableProfil(data): Observable<any> {
        const url: string = (<string>EndPointUrl.DISABLE_PROFIL).replace(
            '{id}',
            data
        );
        return this.http.put(`${this.baseUrl}${url}`, {});
    }
    GetAllListAffectationBySim(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_LIST_AFFECTATION_BY_SIM
        )).replace('{page}', page);
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllListSimAffecte(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_LIST_SIM_AFFECTES).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    handleUpdateReferentielTelemetrie(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_REFERENTIEL_TELEMETRIE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    handleUpdateProfilSupervision(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_PROFIL_SUPERVISION;
        return this.http.put(`${this.baseUrl}${url}`, data);
    }
    handleSaveProfilSupervision(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_PROFIL_SUPERVISION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    handleSaveAffectation(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_AFFECTATION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    handleSaveReaffectation(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_REAFFECTATION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    handleRetraitSim(data): Observable<any> {
        const url: string = <string>EndPointUrl.RETRAIT_SIM;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnDeploy(data): Observable<any> {
        const url: string = <string>EndPointUrl.DEPLOYER;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetContactSla(): Observable<any> {
        const url: string = <string>EndPointUrl.GET_CONTACT_GESTION_SLA;
        return this.http.post(`${this.baseUrl}${url}`, {});
    }
    UpdateContactSla(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_CONTACT_GESTION_SLA;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
