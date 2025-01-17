import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EncodingDataService } from '../../../../shared/services/encoding-data.service';
import { EndPointUrl } from './api.enum';

@Injectable()

export class ComptabiliteService {
    public baseUrl: string;
    public httpOptions: any;

    constructor(
        private http: HttpClient,
        private storage: EncodingDataService
    ) {
        const data = JSON.parse(this.storage.getData('user') || null);
        this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`;
    }

    PostGestionFactureFacture(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_GESTION_FACTURE_FACTURES).replace('{page}', page);
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    PostGestionFactureFacturesDetails(numeroDemande: string): Observable<any> {
        const url: string = <string>EndPointUrl.POST_GESTION_FACTURE_FACTURES_DETAILS.replace('{numeroDemande}', numeroDemande);
        return this.http.post(`${this.baseUrl}${url}`, {});
    }

}