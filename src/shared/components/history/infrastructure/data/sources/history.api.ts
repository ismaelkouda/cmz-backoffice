import { Injectable, inject } from '@angular/core';
import { HistoryFilterApiDto } from '@shared/components/history/infrastructure/api/dto/history-filter-api.dto';
import { HistoryResponseApiDto } from '@shared/components/history/infrastructure/api/dto/history-response.api.dto';
import { HISTORY_ENDPOINTS } from '@shared/components/history/infrastructure/api/dto/history.endpoints';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_URL);

    readAll(
        filter: HistoryFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<HistoryResponseApiDto> {
        const url = `${this.baseUrl}${HISTORY_ENDPOINTS.HISTORY}?page=${page}`;
        const params = buildHttpParams(filter);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<HistoryResponseApiDto>(url, {
            params,
            context,
        });
    }
}
