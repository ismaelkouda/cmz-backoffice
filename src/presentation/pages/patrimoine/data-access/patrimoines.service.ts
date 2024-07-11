import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EncodingDataService } from 'src/shared/services/encoding-data.service'
import { EndPointUrl } from 'src/presentation/pages/patrimoine/data-access/api.enum';  

@Injectable()

export class PatrimoinesService {
    
  public baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    private storage: EncodingDataService,
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
  }
    PostPatrimoineSimSimsAllPage(data: Object, page: number): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_PATRIMOINE_SIM_SIMS_ALL_PAGE).replace('{page}', JSON.stringify(page));
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
      }

      PostPatrimoineSimSimsimsiDetails(imsi: string): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_PATRIMOINE_SIM_SIMS_imsi_Details).replace('{imsi}', imsi)
        return this.httpClient.post(`${this.baseUrl}${url}`, {});
      }
      PostPatrimoineSimSimsUpdate(data): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_PATRIMOINE_SIM_SIMS_UPDATE);
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
      }

      PostPatrimoineSimEtatsDesSoldesActualisationSimple(data): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_PATRIMOINE_SIM_ETATS_DES_SOLDES_ACTUALISATION_SIMPLE);
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
      }
      PostParametresSecuriteNiveauDeuxSimple(data: Object): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_PARAMETRES_SECURITE_NIVEAU_DEUX_SIMPLE)
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
      }

      PostParametresSecuriteNiveauUnSimple(data: Object): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_PARAMETRES_SECURITE_NIVEAU_UN_SIMPLE)
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
      }

      PostPatrimoineSimSimsAllUsages(data: Object): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_PATRIMOINE_SIM_SIMS_ALL_USAGES)
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
      }

      PostParametresSecuriteNiveauTroisSimple(data: Object): Observable<any> {
        const url: string = (<string>EndPointUrl.POST_PARAMETRES_SECURITE_NIVEAU_TROIS_SIMPLE)
        return this.httpClient.post(`${this.baseUrl}${url}`, data);
      }
}