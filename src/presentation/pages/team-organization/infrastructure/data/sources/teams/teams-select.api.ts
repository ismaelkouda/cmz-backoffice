import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TeamsSelectResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-select-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(TEAM_ORGANIZATION_BASE_URL);

    readAll(): Observable<TeamsSelectResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/select-field`;
        return this.http.get<TeamsSelectResponseApiDto>(url);
    }
}
