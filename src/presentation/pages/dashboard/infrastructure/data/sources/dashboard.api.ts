import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { DASHBOARD_BASE_URL } from '@presentation/pages/dashboard/infrastructure/api/dashboard.base-url';
import { DASHBOARD_ENDPOINTS } from '@presentation/pages/dashboard/infrastructure/api/dashboard.endpoints';
import { DashboardFilterApiDto } from '@presentation/pages/dashboard/infrastructure/api/dto/dashboard-filter-api.dto';
import { DashboardResponseApiDto } from '@presentation/pages/dashboard/infrastructure/api/dto/dashboard-response-api.dto';

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
        console.log('🚀 ~ DashboardApi ~ execute ~ params:', params);

        return this.http.get<DashboardResponseApiDto>(url, { params });
    }
}
