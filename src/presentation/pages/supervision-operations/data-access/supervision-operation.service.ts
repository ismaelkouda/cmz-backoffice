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

  public baseUrl: any = appConfig.serverUrl;

  constructor(
    private http: HttpClient
  ) { }

  GetAllTransactions(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_TRANSACTIONS).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  GetDetailTransaction(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_DETAIL_TRANSACTION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  GetAllPriseEnCharge(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PRISE_EN_CHARGE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnSaveTransaction(data): Observable<any> {
    const url: string = (<string>EndPointUrl.VALIDER_TRANSACTION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

}
