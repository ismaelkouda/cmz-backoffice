import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsFindOneFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-findone-filter-api.dto';
import { ParticipantsFindOneResponseApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-findone-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@presentation/pages/team-organization/infrastructure/api/team-organization.endpoints';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindonApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: ParticipantsFindOneFilterApiDto
    ): Observable<ParticipantsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${filter?.id}`;
        return this.http.get<ParticipantsFindOneResponseApiDto>(url);
    }
}
