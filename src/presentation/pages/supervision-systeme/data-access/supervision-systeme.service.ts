import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Injectable({
    providedIn: 'root',
})
export class SupervisionSystemeService {
    public baseUrl: string;

    constructor(
        private http: HttpClient,
        private storage: EncodingDataService
    ) {
        const data = JSON.parse(this.storage.getData('user'));
        this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`;
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
