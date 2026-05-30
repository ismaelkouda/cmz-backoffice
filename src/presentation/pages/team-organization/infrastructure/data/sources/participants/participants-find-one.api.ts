import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ParticipantsFindOneFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-find-one-filter-api.dto';
import { ParticipantsFindOneResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-find-one-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(TEAM_ORGANIZATION_BASE_URL);

    read(
        filter?: ParticipantsFindOneFilterApiDto
    ): Observable<ParticipantsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${filter?.id}`;
        return this.http.get<ParticipantsFindOneResponseApiDto>(url);
    }
}
