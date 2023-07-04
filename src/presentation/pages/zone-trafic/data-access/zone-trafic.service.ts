import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';

@Injectable({
  providedIn: 'root'
})
export class ZoneTraficService {

  public BASE_URL: any = appConfig.serverUrl;

  constructor(
    private http: HttpClient
  ) { }

  GetPositionSimGeojson(id): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_TRAFIC_GEOJSON).replace('{id}', id);
    return this.http.get(`${this.BASE_URL}${url}`);
  }

  GetAllZOneTrafic(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_ZONE_TRAFIC).replace('{page}', page);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

  GetAllDepartements(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_DEPARTEMENT);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

  GetAllCommunes(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_COMMUNE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
}
