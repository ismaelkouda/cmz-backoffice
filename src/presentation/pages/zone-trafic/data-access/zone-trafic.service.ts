import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { EnvService } from '../../../../shared/services/env.service';

@Injectable({
    providedIn: 'root',
})
export class ZoneTraficService {
    public baseUrl: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }

    GetPositionSimGeojson(id): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_TRAFIC_GEOJSON).replace(
            '{id}',
            id
        );
        return this.http.get(`${this.baseUrl}${url}`);
    }
    GetPositionSimTracking(id): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_TRACKING_GEOJSON).replace(
            '{id}',
            id
        );
        return this.http.get(`${this.baseUrl}${url}`);
    }
    GetAllZOneTrafic(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_ALL_ZONE_TRAFIC).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetAllDepartements(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_DEPARTEMENT;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllSites(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_ALL_SITE).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllCommunes(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_COMMUNE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
