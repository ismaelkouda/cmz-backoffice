import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';

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
  GetAllDemandes(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_DEMANDES);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllPriseEnCharge(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PRISE_EN_CHARGE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnUpdateTransaction(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_TRANSACTION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnCancelTransaction(data): Observable<any> {
    const url: string = (<string>EndPointUrl.CANCEL_TRANSACTION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnCloseTransaction(data): Observable<any> {
    const url: string = (<string>EndPointUrl.CLOSE_TRANSACTION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  HandleFormatTitle(title: string) {
    switch (title) {
      case OperationTransaction.ACHAT_SERVICE: {
        return "Achat de Services";
      }
      case OperationTransaction.ACTIVATION: {
        return "Activation de SIM";
      }
      case OperationTransaction.SWAP: {
        return "Changement de SIM";
      }
      case OperationTransaction.SUSPENSION: {
        return "Suspension de SIM";
      }
      case OperationTransaction.RESILIATION: {
        return "Résiliation de SIM";
      }
      case OperationTransaction.VOLUME_DATA: {
        return "Depot de volume	";
      }
      case 'provisionning': {
        return 'Ligne de Credit';
      }
      default:
        return 'N/A'
    }
  }


}
