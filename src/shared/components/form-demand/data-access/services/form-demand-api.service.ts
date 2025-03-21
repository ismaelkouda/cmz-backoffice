import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EncodingDataService } from '../../../../services/encoding-data.service';
import { FormDemandEndpointEnum } from '../enums/form-demand-endpoint.enum';

@Injectable()

export class FormDemandApiService {
    public baseUrl: string;

    constructor(private http: HttpClient, private storage: EncodingDataService) {
        const data = JSON.parse(this.storage.getData('user'))
        this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
    }
    SaveDemand(data): Observable<any> {
        const url: string = <string>FormDemandEndpointEnum.PATRIMOINE_SIM_TRANSACTION_SUR_SIM;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

}
