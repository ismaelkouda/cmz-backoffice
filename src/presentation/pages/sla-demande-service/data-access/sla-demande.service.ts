import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';

@Injectable({
  providedIn: 'root'
})
export class SlaDemandeService {

  public baseUrl: any = appConfig.serverUrl;

constructor(
  private http: HttpClient

) { }


GetActivationTransactions(data, page): Observable<any> {
  const url: string = (<string>EndPointUrl.GET_ALL_ACTIVATION_TRANSACTION).replace('{page}', page);
  return this.http.post(`${this.baseUrl}${url}`, data);
}

GetAllSwappingTransactions(data, page): Observable<any> {
  const url: string = (<string>EndPointUrl.GET_ALL_SWAPPING_TRANSACTION).replace('{page}', page);
  return this.http.post(`${this.baseUrl}${url}`, data);
}

GetAllResiliationTransactions(data, page): Observable<any> {
  const url: string = (<string>EndPointUrl.GET_ALL_RESILIATION_TRANSACTION).replace('{page}', page);
  return this.http.post(`${this.baseUrl}${url}`, data);
}

GetAllSuspensionTransactions(data, page): Observable<any> {
  const url: string = (<string>EndPointUrl.GET_ALL_SUSPENSION_TRANSACTION).replace('{page}', page);
  return this.http.post(`${this.baseUrl}${url}`, data);
}

GetAllVolumeTransactions(data, page): Observable<any> {
  const url: string = (<string>EndPointUrl.GET_ALL_VOLUME_DATA_TRANSACTION).replace('{page}', page);
  return this.http.post(`${this.baseUrl}${url}`, data);
}

}
