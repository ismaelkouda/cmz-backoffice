import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { DownloadFilterApiDto } from '@pages/report-states/infrastructure/api/dto/download/download-filter-api.dto';
import { DownloadResponseApiDto } from '@pages/report-states/infrastructure/api/dto/download/download-response-api.dto';
import { REPORT_STATES_BASE_URL } from '@presentation/pages/report-states/infrastructure/api/report-states.base-url';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DownloadApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_STATES_BASE_URL);

    execute(
        filter: DownloadFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<DownloadResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.DOWNLOAD}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<DownloadResponseApiDto>(url, {
            params,
            context,
        });
    }
}
