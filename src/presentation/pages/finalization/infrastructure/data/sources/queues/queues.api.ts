import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { QueuesFilterApiDto } from '@pages/finalization/infrastructure/api/dto/queues/queues-filter-api.dto';
import { QueuesResponseApiDto } from '@pages/finalization/infrastructure/api/dto/queues/queues-response-api.dto';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { FINALIZATION_ENDPOINTS } from '@pages/finalization/infrastructure/api/finalization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(REPORT_API_URL);

    execute(
        filter: QueuesFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<QueuesResponseApiDto> {
        const url = `${this.baseUrl}${FINALIZATION_ENDPOINTS.QUEUES}?page=${page}`;
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
