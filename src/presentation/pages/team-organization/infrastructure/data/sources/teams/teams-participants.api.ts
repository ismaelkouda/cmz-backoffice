import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { buildHttpParams } from '@shared/utils/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { TeamsParticipantsFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-filter-api.dto';
import { TeamsParticipantsReassignApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-reassign-api.dto';
import { TeamsParticipantsRemoveApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-remove-api.dto';
import { TeamsParticipantsResponseApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@presentation/pages/team-organization/infrastructure/api/team-organization.endpoints';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: TeamsParticipantsFilterApiDto,
        page: string
    ): Observable<TeamsParticipantsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<TeamsParticipantsResponseApiDto>(url, {
            params,
        });
    }

    reassign(
        dto: TeamsParticipantsReassignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/reassign`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    remove(
        dto: TeamsParticipantsRemoveApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/remove`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
