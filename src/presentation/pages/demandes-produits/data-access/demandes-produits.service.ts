import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EnvService } from '../../../../shared/services/env.service';

@Injectable({ providedIn: 'root' })
export class DemandesProduitsService {
    public baseUrl: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }

    postCommandeProduitCommandesAll(data, page): Observable<any> {
        const url: string = <string>(
            EndPointUrl.POST_COMMANDE_PRODUIT_COMMANDES_ALL.replace(
                '{page}',
                page
            )
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    postCommandeProduitCommandesStore(data): Observable<any> {
        const url: string = <string>(
            EndPointUrl.POST_COMMANDE_PRODUIT_COMMANDES_STORE
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    postCommandeProduitTransactionAll(data, page): Observable<any> {
        const url: string = (<string>(
            EndPointUrl.POST_COMMANDE_PRODUIT_TRANSACTION_ALL
        )).replace('{page}', page);
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
