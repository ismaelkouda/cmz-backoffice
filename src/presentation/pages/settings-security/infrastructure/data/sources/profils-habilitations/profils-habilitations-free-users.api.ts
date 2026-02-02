import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { ProfilsHabilitationsFreeUsersAssignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-free-users-assign-api.dto';
import { ProfilsHabilitationsFreeUsersResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-free-users-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class ProfilsHabilitationsFreeUsersApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        page: string
    ): Observable<ProfilsHabilitationsFreeUsersResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}?page=${page}`;

        return this.http.get<ProfilsHabilitationsFreeUsersResponseApiDto>(url);
    }

    assign(
        dto: ProfilsHabilitationsFreeUsersAssignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/assign`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
