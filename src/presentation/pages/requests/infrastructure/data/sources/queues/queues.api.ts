import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { QueuesFilterApiDto } from '@presentation/pages/requests/infrastructure/api/dto/queues/queues-filter-api.dto';
import { QueuesResponseApiDto } from '@presentation/pages/requests/infrastructure/api/dto/queues/queues-response-api.dto';
import { REQUESTS_BASE_URL } from '@presentation/pages/requests/infrastructure/api/report-requests.base-url';
import { REQUESTS_ENDPOINTS } from '@presentation/pages/requests/infrastructure/api/report-requests.endpoints';

@Injectable({ providedIn: 'root' })
export class QueuesApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REQUESTS_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: QueuesFilterApiDto,
        page: string
    ): Observable<QueuesResponseApiDto> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.QUEUES}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<QueuesResponseApiDto>(url, {
            params,
        });
    }
}
