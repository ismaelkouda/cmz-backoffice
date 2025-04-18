import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// @ts-ignore
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EnvService } from '../../../../shared/services/env.service';
@Injectable({
    providedIn: 'root',
})
export class InterconnexionService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    GetAllConnexions(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_CONNEXION;
        return this.http.post(`${this.BASE_URL}${url}`, data);
    }
}
