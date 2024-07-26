import { EnvService } from '../../../../shared/services/env.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';

@Injectable()

export class DashboardService {

  public baseUrl: string;

  constructor(private http: HttpClient, private envService: EnvService
  ) {this.baseUrl = this.envService.apiUrl;}

  GetDashboardStatistique(): Observable<any> {
    const url: string = (<string>EndPointUrl.DASHBOARD_STATISTIQUES);
    return this.http.get(`${this.baseUrl}${url}`);
  }
}
