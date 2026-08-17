import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { TeamsParticipantsAssignApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-assign-api.dto';
import { TeamsParticipantsFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-filter-api.dto';
import { TeamsParticipantsReassignApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-reassign-api.dto';
import { TeamsParticipantsRemoveApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-remove-api.dto';
import { TeamsParticipantsResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-response-api.dto';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_URL);

    readAll(
        dto: TeamsParticipantsFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<TeamsParticipantsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/members?page=${page}`;
        const params = buildHttpPayload(dto, ['uniq_id']);

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<TeamsParticipantsResponseApiDto>(url, {
            params,
            context,
        });
    }

    assign(
        dto: TeamsParticipantsAssignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/affect-members`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
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
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/remove-members`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }
}
