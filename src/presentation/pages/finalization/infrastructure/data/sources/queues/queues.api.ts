import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { QueuesFilterApiDto } from '@presentation/pages/finalization/infrastructure/api/dto/queues/queues-filter-api.dto';
import { QueuesResponseApiDto } from '@presentation/pages/finalization/infrastructure/api/dto/queues/queues-response-api.dto';
import { FINALIZATION_BASE_URL } from '@presentation/pages/finalization/infrastructure/api/finalization.base-url';
import { FINALIZATION_ENDPOINTS } from '@presentation/pages/finalization/infrastructure/api/finalization.endpoints';

@Injectable({ providedIn: 'root' })
export class QueuesApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(FINALIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: QueuesFilterApiDto,
        page: string
    ): Observable<QueuesResponseApiDto> {
        const url = `${this.baseUrl}${FINALIZATION_ENDPOINTS.QUEUES}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<QueuesResponseApiDto>(url, {
            params,
        });
    }
}
