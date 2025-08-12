import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormDemandEndpointEnum } from '../enums/form-demand-endpoint.enum';
import { EnvService } from '../../../../services/env.service';

@Injectable()
export class FormDemandApiService {
    public baseUrl: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }
    SaveDemand(data): Observable<any> {
        const url: string = <string>(
            FormDemandEndpointEnum.PATRIMOINE_SIM_TRANSACTION_SUR_SIM
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    SaveImportation(data): Observable<any> {
        const url: string = <string>FormDemandEndpointEnum.SAVE_IMPORTATION_SIM;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
