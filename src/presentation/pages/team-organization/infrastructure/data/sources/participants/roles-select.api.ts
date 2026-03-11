import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RolesSelectResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/roles-select-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RolesSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(): Observable<RolesSelectResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.ROLES}/roles`;
        return this.http.get<RolesSelectResponseApiDto>(url);
    }
}
