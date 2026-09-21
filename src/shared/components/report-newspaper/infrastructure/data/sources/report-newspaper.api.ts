import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { ReportNewspaperFilterApiDto } from '@shared/components/report-newspaper/infrastructure/api/dto/report-newspaper-filter-api.dto';
import { ReportNewspaperResponseApiDto } from '@shared/components/report-newspaper/infrastructure/api/dto/report-newspaper-response-api.dto';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { REPORT_NEWSPAPER_ENDPOINTS } from '@shared/components/report-newspaper/infrastructure/api/report-newspaper.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportNewspaperApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_API_URL);

    execute(
        apiDto: ReportNewspaperFilterApiDto,
        options?: FetchOptions
    ): Observable<ReportNewspaperResponseApiDto> {
        const path = REPORT_NEWSPAPER_ENDPOINTS.NEWSPAPER.replace(
            '{requestOrReportUniqId}',
            apiDto.uniq_id
        );
        const url = `${this.baseUrl}${path}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ReportNewspaperResponseApiDto>(url, {
            context,
        });
    }
}
