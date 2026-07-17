import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { DailyGoalFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/daily-goal/daily-goal-filter-api.dto';
import { DailyGoalResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/daily-goal/daily-goal-response-api.dto';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DailyGoalApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_URL);

    execute(
        filter: DailyGoalFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<DailyGoalResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.DAILY_GOAL}?page=${page}`;

        const params = buildHttpParams(filter);

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<DailyGoalResponseApiDto>(url, {
            params,
            context,
        });
    }
}
