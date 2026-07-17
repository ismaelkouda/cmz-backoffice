import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ReportByChannelResponseDto } from '../../api/dto/report-by-channel/report-by-channel-response.dto';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportByChannelApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    getReportByChannel(
        options?: FetchOptions
    ): Observable<ReportByChannelResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REPORT_BY_CHANNEL}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ReportByChannelResponseDto>(url, {
            context,
        });
    }
}
