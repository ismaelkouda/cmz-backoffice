import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';

@Injectable({
  providedIn: 'root'
})
export class SupervisionSystemeService {

  public BASE_URL: any = appConfig.serverUrl;

  constructor(
    private http: HttpClient

  ) { }


  GetAllEtatServices(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_ETAT_SERVICES);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllTauxCharges(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_TAUX_CHARGES);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

}
