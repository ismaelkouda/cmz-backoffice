import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { AllFilterApiDto } from '@presentation/pages/requests/infrastructure/api/dto/all/all-filter-api.dto';
import { AllResponseApiDto } from '@presentation/pages/requests/infrastructure/api/dto/all/all-response-api.dto';
import { REQUESTS_BASE_URL } from '@presentation/pages/requests/infrastructure/api/report-requests.base-url';
import { REQUESTS_ENDPOINTS } from '@presentation/pages/requests/infrastructure/api/report-requests.endpoints';

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
        const params = buildHttpParams(filter);
        return this.http.get<AllResponseApiDto>(url, {
            params,
        });
    }
}
