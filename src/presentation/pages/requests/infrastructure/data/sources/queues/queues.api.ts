import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache.interceptor';
import { QueuesFilterApiDto } from '@pages/requests/infrastructure/api/dto/queues/queues-filter-api.dto';
import { QueuesResponseApiDto } from '@pages/requests/infrastructure/api/dto/queues/queues-response-api.dto';
import { REQUESTS_BASE_URL } from '@presentation/pages/requests/infrastructure/api/requests.base-url';
import { REQUESTS_ENDPOINTS } from '@presentation/pages/requests/infrastructure/api/requests.endpoints';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REQUESTS_BASE_URL);

    execute(
        filter: QueuesFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<QueuesResponseApiDto> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.QUEUES}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<QueuesResponseApiDto>(url, {
            params,
            context,
        });
    }
}
