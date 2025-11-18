import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '@shared/services/env.service';
import { DashboardEndpoint } from '@pages/dashboard/data/constants/dashboard-endpoints.constant';
import { DashboardResponseDto } from '@pages/dashboard/data/dtos/dashboard-response.dto';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    loadStatistics(
        params: { days: string } | Record<string, never>
    ): Observable<DashboardResponseDto> {
        const url = `${this.baseUrl}${DashboardEndpoint.STATISTICS}`;
        let httpParams = new HttpParams();

        if ('days' in params && params.days) {
            httpParams = httpParams.set('days', params.days);
        }

        return this.http.get<DashboardResponseDto>(url, {
            params: httpParams,
        });
    }
}

