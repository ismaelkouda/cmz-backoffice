import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EndPointUrl } from "./api.enum";
import { EnvService } from "../../../../shared/services/env.service";

@Injectable()

export class GestionIdentificationsService {
  public baseUrl: any;

  constructor(private http: HttpClient, private envService: EnvService) {
    this.baseUrl = this.envService.apiUrl;
  }

  PostGestionIdentificationsFileAttentes(data, page): Observable<any> {
    const url: string = <string>EndPointUrl.POST_GESTION_IDENTIFICATIONS_FILE_ATTENTES.replace(
      "{page}",
      page
    );
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  

  PostGestionIdentificationsDetails(data): Observable<any> {
    const url: string = <string>EndPointUrl.GET_ALL_DETAILS;
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
}
