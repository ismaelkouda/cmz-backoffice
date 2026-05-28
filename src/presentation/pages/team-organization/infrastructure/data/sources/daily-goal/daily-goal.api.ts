import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DailyGoalFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/daily-goal/daily-goal-filter-api.dto';
import { DailyGoalResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/daily-goal/daily-goal-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DailyGoalApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(TEAM_ORGANIZATION_BASE_URL);

    execute(
        filter: DailyGoalFilterApiDto,
        page: string
    ): Observable<DailyGoalResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.DAILY_GOAL}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<DailyGoalResponseApiDto>(url, { params });
    }
}
