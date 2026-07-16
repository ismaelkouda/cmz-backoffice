import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { QueuesFilterApiDto } from '@pages/requests/infrastructure/api/dto/queues/queues-filter-api.dto';
import { QueuesResponseApiDto } from '@pages/requests/infrastructure/api/dto/queues/queues-response-api.dto';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { REQUESTS_ENDPOINTS } from '@presentation/pages/requests/infrastructure/api/requests.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
@Injectable({ providedIn: 'root' })
export class QueuesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_API_URL);

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
