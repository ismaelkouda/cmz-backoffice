import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardEndpoint } from '@pages/dashboard/data/constants/dashboard-endpoints.constant';
import { DashboardResponseDto } from '@pages/dashboard/data/dtos/dashboard-response.dto';
import { Filter } from '@shared/application/base/object-base-facade';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) { }

    loadStatistics(
        params: Filter
    ): Observable<DashboardResponseDto> {
        const url = `${this.baseUrl}${DashboardEndpoint.STATISTICS}`;
        let httpParams = new HttpParams();

        if ('period' in params && params.period) {
            httpParams = httpParams.set('period', params['period'].toString());
        }

        return this.http.get<DashboardResponseDto>(url, {
            params: httpParams,
        });
    }
}
