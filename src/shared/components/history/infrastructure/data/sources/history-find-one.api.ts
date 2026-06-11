import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { HistoryFindOneFilterApiDto } from '@shared/components/history/infrastructure/api/dto/history-find-one-filter-api.dto';
import { HistoryFindOneResponseApiDto } from '@shared/components/history/infrastructure/api/dto/history-find-one-response-api.dto';
import { HISTORY_ENDPOINTS } from '@shared/components/history/infrastructure/api/dto/history.endpoints';
import { HISTORY_BASE_URL } from '@shared/components/history/infrastructure/api/history.base-url';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(HISTORY_BASE_URL);

    read(
        dto: HistoryFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<HistoryFindOneResponseApiDto> {
        const { id, ...filterParams } = dto;
        const params = buildHttpParams(filterParams, { skipEmptyString: true });
        const uniq_id = id ? `/${id}` : '';
        const url = `${this.baseUrl}${HISTORY_ENDPOINTS.HISTORY}${uniq_id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<HistoryFindOneResponseApiDto>(url, {
            params,
            context,
        });
    }
}
