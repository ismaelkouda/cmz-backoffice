import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';

@Injectable({
  providedIn: 'root'
})
export class SupervisionOperationService {

  public BASE_URL: any = appConfig.serverUrl;

  constructor(
    private http: HttpClient
  ) { }

  GetAllTrnasactions(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_TRANSACTIONS);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

  GetAllPriseEnCharge(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PRISE_EN_CHARGE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

}
