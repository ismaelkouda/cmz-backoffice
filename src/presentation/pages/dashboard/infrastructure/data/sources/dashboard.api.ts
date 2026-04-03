import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DASHBOARD_BASE_URL } from '@pages/dashboard/infrastructure/api/dashboard.base-url';
import { DASHBOARD_ENDPOINTS } from '@pages/dashboard/infrastructure/api/dashboard.endpoints';
import { DashboardFilterApiDto } from '@pages/dashboard/infrastructure/api/dto/dashboard-filter-api.dto';
import { DashboardResponseApiDto } from '@pages/dashboard/infrastructure/api/dto/dashboard-response-api.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(DASHBOARD_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        apiDto: DashboardFilterApiDto
    ): Observable<DashboardResponseApiDto> {
        const url = `${this.baseUrl}${DASHBOARD_ENDPOINTS.STATISTICS}`;
        const params = buildHttpParams(apiDto);
        return this.http.get<DashboardResponseApiDto>(url, { params });
    }
}
