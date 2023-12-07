import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Injectable({
  providedIn: 'root'
})
export class SupervisionOperationService {

  public baseUrl: string;

  constructor(
    private http: HttpClient,
    private storage: EncodingDataService,
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
  }

  GetAllTransactions(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_TRANSACTIONS).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllPriseEnCharge(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PRISE_EN_CHARGE).replace('{page}', page);
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

  GetAllContencieux(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_CONTENCIEUX);
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
