import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { buildHttpParams } from '@shared/utils/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { ParticipantsCreateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-create-api.dto';
import { ParticipantsFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-filter-api.dto';
import { ParticipantsResponseApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-response-api.dto';
import { ParticipantsUpdateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-update-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@presentation/pages/team-organization/infrastructure/api/team-organization.endpoints';

@Injectable({ providedIn: 'root' })
export class ParticipantsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: ParticipantsFilterApiDto,
        page: string
    ): Observable<ParticipantsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<ParticipantsResponseApiDto>(url, {
            params,
        });
    }

    create(
        apiDto: ParticipantsCreateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(
        apiDto: ParticipantsUpdateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(id: string): Observable<SimpleResponseDto<void>> {
        console.log('id4', id);
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${id}/delete`;
        console.log('url', url);
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
