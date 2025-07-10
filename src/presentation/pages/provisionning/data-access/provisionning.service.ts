import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';
import { Observable } from 'rxjs';
import { CurrentUser } from '../../../../shared/interfaces/current-user.interface';
import { EncodingDataService } from '../../../../shared/services/encoding-data.service';

@Injectable({
    providedIn: 'root',
})
export class ProvisionningService {
    public baseUrl: string;

    constructor(
        private http: HttpClient,
        private encodingService: EncodingDataService
    ) {
        const data: CurrentUser | null =
            this.encodingService.getData('user_data');
        this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`;
    }

    GetAllCommandes(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_COMMANDES_SIM;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    // Ligne Credits
    GetAllLigneCredits(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_ALL_LIGNE_CREDIT).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnSaveCredit(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_PROVISION_CREDIT;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnCancelCredit(data): Observable<any> {
        const url: string = <string>EndPointUrl.CANCEL_CREDIT;
        return this.http.put(`${this.baseUrl}${url}`, data);
    }
    OnStatCredit(data): Observable<any> {
        const url: string = <string>EndPointUrl.STAT_CREDIT;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    //Achats Produits & Services

    GetAllAchats(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_ALL_ACHATS).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllServices(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_SERVICES;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GenerateNumeroCommande(): Observable<any> {
        const url: string = '';
        return this.http.get(`${this.baseUrl}${url}`);
    }
    OnSaveCommande(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_COMMANDE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnValidate(data): Observable<any> {
        const url: string = <string>EndPointUrl.VALIDATE_COMMANDE_PROFORMAT;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnStatAchat(data): Observable<any> {
        const url: string = <string>EndPointUrl.STAT_ACHAT;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    //Stocks Produits & Services
    GetAllStocks(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_ALL_STOCKS).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
