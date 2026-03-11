import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TeamsPermissionsResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-permissions-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(): Observable<TeamsPermissionsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/get-permissions-model`;
        return this.http.get<TeamsPermissionsResponseApiDto>(url);
    }
}
