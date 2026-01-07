import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RequestFilter } from '@presentation/pages/reporting/core/domain/value-objects/requests/request-filter.vo';
import { Observable } from 'rxjs';
import { RequestResponseDto } from '../../api/dtos/requests/request-response.dto';
import { REPORTING_API_BASE_URL } from '../../api/reporting.config';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';

@Injectable({
    providedIn: 'root',
})
export class RequestApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REPORTING_API_BASE_URL) private readonly baseUrl: string
    ) { }

    getRequests(): Observable<RequestResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REQUESTS}`;

        /* const params = this.createHttpParams(paramsDto); */

        return this.http.get<RequestResponseDto>(url);
    }

    private createHttpParams(payload: RequestFilter): HttpParams {
        let params = new HttpParams();

        if (payload) {
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (value instanceof Date) {
                        params = params.set(key, value.toISOString());
                    } else {
                        params = params.set(key, String(value));
                    }
                }
            });
        }

        return params;
    }
}
