import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ParticipantsCreateApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-create-api.dto';
import { ParticipantsDeleteApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-delete-api.dto';
import { ParticipantsDisableApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-disable-api.dto';
import { ParticipantsEnableApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-enable-api.dto';
import { ParticipantsFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-filter-api.dto';
import { ParticipantsResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-response-api.dto';
import { ParticipantsUpdateApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-update-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

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

    delete(
        apiDto: ParticipantsDeleteApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${apiDto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(
        apiDto: ParticipantsEnableApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${apiDto.uniq_id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(
        apiDto: ParticipantsDisableApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${apiDto.uniq_id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
