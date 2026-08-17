import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { TeamsFindOneFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-find-one-filter-api.dto';
import { TeamsFindOneResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-find-one-response-api.dto';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_URL);

    readAll(
        filter: TeamsFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<TeamsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${filter.id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<TeamsFindOneResponseApiDto>(url, {
            context,
        });
    }
}
