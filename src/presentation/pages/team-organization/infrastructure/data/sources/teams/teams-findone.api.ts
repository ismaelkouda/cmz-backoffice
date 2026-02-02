import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsFindOneFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-findone-filter-api.dto';
import { TeamsFindOneResponseApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-findone-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@presentation/pages/team-organization/infrastructure/api/team-organization.endpoints';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(filter: TeamsFindOneFilterApiDto): Observable<TeamsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${filter.id}`;
        return this.http.get<TeamsFindOneResponseApiDto>(url);
    }
}
