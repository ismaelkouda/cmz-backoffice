import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { buildHttpParams } from '@shared/utils/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { TeamsCreateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-create-api.dto';
import { TeamsFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-filter-api.dto';
import { TeamsResponseApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-response-api.dto';
import { TeamsUpdateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-update-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@presentation/pages/team-organization/infrastructure/api/team-organization.endpoints';

@Injectable({ providedIn: 'root' })
export class TeamsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: TeamsFilterApiDto,
        page: string
    ): Observable<TeamsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<TeamsResponseApiDto>(url, {
            params,
        });
    }

    create(apiDto: TeamsCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(apiDto: TeamsUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        console.log('id', id);
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    delete(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/${id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
