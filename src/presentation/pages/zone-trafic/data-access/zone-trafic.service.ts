import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneTraficService {

  public baseUrl: string;

  constructor(
    private http: HttpClient,
    private storage: EncodingDataService

  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
   }

  GetPositionSimGeojson(id): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_TRAFIC_GEOJSON).replace('{id}', id);
    return this.http.get(`${this.baseUrl}${url}`);
  }
  GetPositionSimTracking(id): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_TRACKING_GEOJSON).replace('{id}', id);
    return this.http.get(`${this.baseUrl}${url}`);
  }
  GetAllZOneTrafic(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_ZONE_TRAFIC).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  GetAllDepartements(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_DEPARTEMENT);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllSites(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_SITE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllCommunes(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_COMMUNE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
}
