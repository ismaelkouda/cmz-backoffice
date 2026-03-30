import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { QueuesFilterApiDto } from '@pages/processing/infrastructure/api/dto/queues/queues-filter-api.dto';
import { QueuesResponseApiDto } from '@pages/processing/infrastructure/api/dto/queues/queues-response-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(PROCESSING_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: QueuesFilterApiDto,
        page: string
    ): Observable<QueuesResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.QUEUES}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<QueuesResponseApiDto>(url, {
            params,
        });
    }
}
