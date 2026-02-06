import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { buildHttpParams } from '@shared/utils/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { ProfilsHabilitationsUsersFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-filter-api.dto';
import { ProfilsHabilitationsUsersReassignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-reassign-api.dto';
import { ProfilsHabilitationsUsersRemoveApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-remove-api.dto';
import { ProfilsHabilitationsUsersResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class ProfilsHabilitationsUsersApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: ProfilsHabilitationsUsersFilterApiDto,
        page: string
    ): Observable<ProfilsHabilitationsUsersResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<ProfilsHabilitationsUsersResponseApiDto>(url, {
            params,
        });
    }

    reassign(
        dto: ProfilsHabilitationsUsersReassignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/reassign`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    remove(
        dto: ProfilsHabilitationsUsersRemoveApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/remove`;
        const payload = buildHttpPayload(dto, ['profile_user_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
