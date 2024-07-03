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

  GetSupervisionOperationsDemandesServicesDetails(numeroDemande: string): Observable<any> {
    const url: string = <string>EndPointUrl.GET_SUPERVISION_OPERATIONS_DEMANDES_SERVICES_numeroDemande_DETAILS.replace('{numeroDemande}', numeroDemande);
    return this.http.get(`${this.baseUrl}${url}`);
  }

  GetAllDemandes(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_DEMANDES).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllTransactions(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_TRANSACTIONS).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllPriseEnCharge(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PRISE_EN_CHARGE).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  PostSupervisionOperationsTraitementsSuivisIdentificationsSims(data): Observable<any> {
    const url: string = (<string>EndPointUrl.POST_SUPERVISION_OPERATIONS_TRAITEMENTS_SUIVIS_IDENTIFICATIONS_SIMS);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetDetailTransaction(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_DETAIL_TRANSACTION);
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
  GetAllNotifications(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_NOTIFICATIONS);
    return this.http.post(`${this.baseUrl}${url}`, data);
  } 
  ReadNotifications(data): Observable<any> {
    const url: string = (<string>EndPointUrl.READ_NOTIFICATION);
    return this.http.put(`${this.baseUrl}${url}`, data);
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
  GetAllSla(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_SLA);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  HandleSaveMessage(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_MESSAGE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  HandleUpdateMessage(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_MESSAGE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllMessagesSender(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_MESSAGE_SENDER).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllMessagesRecieve(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_MESSAGE_RECIEVE).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnDetailMessagesSender(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DETAIL_MESSAGE_SENDER);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnDetailMessagesRecive(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DETAIL_MESSAGE_RECIEVE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnDownloadMessage(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DOWNLOAD_MESSAGE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
}
