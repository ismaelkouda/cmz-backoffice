import { EncodingDataService } from './../../../../shared/services/encoding-data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';

@Injectable({
    providedIn: 'root',
})
export class DemandeService {
    public baseUrl: string;

    constructor(
        private http: HttpClient,
        private storage: EncodingDataService
    ) {
        const data = JSON.parse(this.storage.getData('user'));
        this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`;
    }

    GetDemandeServiceByTransaction(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.DEMANDE_SERVICE_ALL).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
