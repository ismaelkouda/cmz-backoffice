import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { EnvService } from '../../../../shared/services/env.service';

@Injectable({
    providedIn: 'root',
})
export class SupervisionSystemeService {
    public baseUrl: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }

    GetAllEtatServices(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_ETAT_SERVICES;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllTauxCharges(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_TAUX_CHARGES;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
