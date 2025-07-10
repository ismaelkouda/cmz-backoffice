import { EncodingDataService } from './../../../../shared/services/encoding-data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EnvService } from '../../../../shared/services/env.service';

@Injectable({
    providedIn: 'root',
})
export class DemandeService {
    public baseUrl: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }

    GetDemandeServiceByTransaction(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.DEMANDE_SERVICE_ALL).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
