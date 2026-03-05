import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';

import { TeamsCreateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-create-api.dto';
import { TeamsDeleteApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-delete-api.dto';
import { TeamsDisableApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-disable-api.dto';
import { TeamsEnableApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-enable-api.dto';
import { TeamsFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-filter-api.dto';
import { TeamsResponseApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-response-api.dto';
import { TeamsUpdateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-update-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@presentation/pages/team-organization/infrastructure/api/team-organization.endpoints';

@Injectable({ providedIn: 'root' })
export class TeamsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        dto: TeamsFilterApiDto,
        page: string
    ): Observable<TeamsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}?page=${page}`;

        const params = buildHttpParams(dto);

        return this.http.get<TeamsResponseApiDto>(url, {
            params,
        });
    }

    create(dto: TeamsCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/store`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(dto: TeamsUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.id}/update`;
        const payload = buildHttpPayload(dto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    enable(dto: TeamsEnableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(dto: TeamsDisableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    delete(dto: TeamsDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${dto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
