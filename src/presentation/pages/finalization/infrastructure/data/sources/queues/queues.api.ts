import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { QueuesFilterApiDto } from '@pages/finalization/infrastructure/api/dto/queues/queues-filter-api.dto';
import { QueuesResponseApiDto } from '@pages/finalization/infrastructure/api/dto/queues/queues-response-api.dto';
import { FINALIZATION_BASE_URL } from '@pages/finalization/infrastructure/api/finalization.base-url';
import { FINALIZATION_ENDPOINTS } from '@pages/finalization/infrastructure/api/finalization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

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
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<QueuesResponseApiDto>(url, {
            params,
        });
    }
}
