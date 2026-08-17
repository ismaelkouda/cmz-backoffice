import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { ParticipantsCreateApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-create-api.dto';
import { ParticipantsDeleteApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-delete-api.dto';
import { ParticipantsDisableApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-disable-api.dto';
import { ParticipantsEnableApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-enable-api.dto';
import { ParticipantsFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-filter-api.dto';
import { ParticipantsResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-response-api.dto';
import { ParticipantsUpdateApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-update-api.dto';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_URL);

    readAll(
        filter: ParticipantsFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<ParticipantsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}?page=${page}`;

        const params = buildHttpParams(filter);

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ParticipantsResponseApiDto>(url, {
            params,
            context,
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
