import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { EnvService } from '../../../../shared/services/env.service';

@Injectable({
    providedIn: 'root',
})
export class SlaDemandeService {
    public baseUrl: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }

    HandleSlaDemandeService(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.SLA_DEMANDE_SERVICE).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetActivationTransactions(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_ALL_ACTIVATION_TRANSACTION
        )).replace('{page}', page);
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetAllSwappingTransactions(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_ALL_SWAPPING_TRANSACTION
        )).replace('{page}', page);
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetAllResiliationTransactions(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_ALL_RESILIATION_TRANSACTION
        )).replace('{page}', page);
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetAllSuspensionTransactions(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_ALL_SUSPENSION_TRANSACTION
        )).replace('{page}', page);
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetAllVolumeTransactions(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.GET_ALL_VOLUME_DATA_TRANSACTION
        )).replace('{page}', page);
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
