import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AllFilterApiDto } from '@pages/requests/infrastructure/api/dto/all/all-filter-api.dto';
import { AllResponseApiDto } from '@pages/requests/infrastructure/api/dto/all/all-response-api.dto';
import { REQUESTS_BASE_URL } from '@pages/requests/infrastructure/api/report-requests.base-url';
import { REQUESTS_ENDPOINTS } from '@pages/requests/infrastructure/api/report-requests.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REQUESTS_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: AllFilterApiDto,
        page: string
    ): Observable<AllResponseApiDto> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.ALL}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<AllResponseApiDto>(url, {
            params,
        });
    }
}
