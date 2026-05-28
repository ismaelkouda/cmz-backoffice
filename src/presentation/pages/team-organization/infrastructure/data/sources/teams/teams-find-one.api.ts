import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TeamsFindOneFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-find-one-filter-api.dto';
import { TeamsFindOneResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-find-one-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(TEAM_ORGANIZATION_BASE_URL);

    readAll(
        filter: TeamsFindOneFilterApiDto
    ): Observable<TeamsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${filter.id}`;
        return this.http.get<TeamsFindOneResponseApiDto>(url);
    }
}
