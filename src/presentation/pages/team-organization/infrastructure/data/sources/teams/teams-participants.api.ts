import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { TeamsParticipantsAssignApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-assign-api.dto';
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
        dto: TeamsParticipantsFilterApiDto,
        page: string
    ): Observable<TeamsParticipantsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/members?page=${page}`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.get<TeamsParticipantsResponseApiDto>(url, {
            params: payload,
        });
    }

    assign(
        dto: TeamsParticipantsAssignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/affect-members`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }

    reassign(
        dto: TeamsParticipantsReassignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/reaffect-members`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }

    remove(
        dto: TeamsParticipantsRemoveApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/remove`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }
}
