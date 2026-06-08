import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache.interceptor';
import { CloseFilterApiDto } from '@pages/report-states/infrastructure/api/dto/close/close-filter-api.dto';
import { CloseResponseApiDto } from '@pages/report-states/infrastructure/api/dto/close/close-response-api.dto';
import { REPORT_STATES_BASE_URL } from '@presentation/pages/report-states/infrastructure/api/report-states.base-url';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloseApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_STATES_BASE_URL);

    execute(
        filter: CloseFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<CloseResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.CLOSE}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<CloseResponseApiDto>(url, {
            params,
            context,
        });
    }
}
