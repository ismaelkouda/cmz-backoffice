import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { DASHBOARD_BASE_URL } from '@pages/dashboard/infrastructure/api/dashboard.base-url';
import { DASHBOARD_ENDPOINTS } from '@pages/dashboard/infrastructure/api/dashboard.endpoints';
import { DashboardFilterApiDto } from '@pages/dashboard/infrastructure/api/dto/dashboard-filter-api.dto';
import { DashboardResponseApiDto } from '@pages/dashboard/infrastructure/api/dto/dashboard-response-api.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(DASHBOARD_BASE_URL);

    execute(
        apiDto: DashboardFilterApiDto,
        options?: FetchOptions
    ): Observable<DashboardResponseApiDto> {
        const url = `${this.baseUrl}${DASHBOARD_ENDPOINTS.STATISTICS}`;
        const params = buildHttpParams(apiDto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<DashboardResponseApiDto>(url, {
            params,
            context,
        });
    }
}
