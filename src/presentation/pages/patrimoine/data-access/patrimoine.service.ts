import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Injectable({
  providedIn: 'root'
})
export class PatrimoineService {

  public baseUrl: string;

  constructor(
    private http: HttpClient,
    private storage: EncodingDataService,
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
  }

  GetAllPatrimoines(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PATRIMOINES).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnGetDetailSim(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DETAILS_SIM).replace('{imsi}', data)
    return this.http.post(`${this.baseUrl}${url}`, {});
  }
  GetAllCycles(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_CYCLES).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllUsages(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_USAGES);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllEtats(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_ETAT_SOLDE).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllTransactions(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_TRANSACTIONS).replace('{page}', page);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnVerify(data): Observable<any> {
    const url: string = (<string>EndPointUrl.VERIFY_PATRIMOINE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnVerifyGroupe(data): Observable<any> {
    const url: string = (<string>EndPointUrl.VERIFY_GROUPE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  UpdatePatrimoine(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_PATRIMOINE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  OnChangeStatut(data): Observable<any> {
    const url: string = (<string>EndPointUrl.CHANGE_STATUT);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnActiver(data): Observable<any> {
    const url: string = (<string>EndPointUrl.ACTIVATION_SIM);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnSwaper(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SWAPER_SIM);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnVolume(data): Observable<any> {
    const url: string = (<string>EndPointUrl.VOLUME_DATA);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllDepartements(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_DEPARTEMENT);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  GetAllCommunes(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_COMMUNE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  GetAllGroupes(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_GROUPE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  HandleUpdateGroupe(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_GROUPE);
    return this.http.put(`${this.baseUrl}${url}`, data);
  }

  HandleDeleteGroupe(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DELETE_GROUPE).replace('{id}', data)
    return this.http.delete(`${this.baseUrl}${url}`);
  }
  HandleSaveGroupe(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_GROUPE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  GetAllSimNoGroupe(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_SIM_NO_GROUPE).replace('{page}', page)
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  
  GetAllsimAtGroupe(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_SIM_AT_GROUPE).replace('{page}', page)
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleSaveAffectation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_AFFECTATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleSaveReaffectation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_REAFFECTATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleRetraitSim(data): Observable<any> {
    const url: string = (<string>EndPointUrl.RETRAIT_SIM);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleActivateGroupe(data): Observable<any> {
    const url: string = (<string>EndPointUrl.ACTIVATE_GROUPE).replace('{id}', data)
    return this.http.put(`${this.baseUrl}${url}`, {});
  }
  handleDisableGroupe(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DISABLE_GROUPE).replace('{id}', data)
    return this.http.put(`${this.baseUrl}${url}`, {});
  }
  GetAllDotations(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_DOTATION).replace('{page}', page)
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleSaveDotation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_DOATATION)
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllDownlaod(page): Observable<any> {
    const url: string = (<string>EndPointUrl.DOWNLOAD_FILE).replace('{page}', page);
    return this.http.get(`${this.baseUrl}${url}`);
  }
  handleRefreshData(data): Observable<any> {
    const url: string = (<string>EndPointUrl.REFRESH_DATA);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
}
