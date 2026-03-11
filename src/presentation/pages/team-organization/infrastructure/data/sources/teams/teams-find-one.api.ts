import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TeamsFindOneFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-find-one-filter-api.dto';
import { TeamsFindOneResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-find-one-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: TeamsFindOneFilterApiDto
    ): Observable<TeamsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${filter.id}`;
        return this.http.get<TeamsFindOneResponseApiDto>(url);
    }
}
