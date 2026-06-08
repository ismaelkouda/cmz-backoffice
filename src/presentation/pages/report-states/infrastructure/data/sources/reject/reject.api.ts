import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache.interceptor';
import { RejectFilterApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-filter-api.dto';
import { RejectResponseApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-response-api.dto';
import { REPORT_STATES_BASE_URL } from '@presentation/pages/report-states/infrastructure/api/report-states.base-url';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RejectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_STATES_BASE_URL);

    execute(
        filter: RejectFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<RejectResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.REJECT}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<RejectResponseApiDto>(url, {
            params,
            context,
        });
    }
}
