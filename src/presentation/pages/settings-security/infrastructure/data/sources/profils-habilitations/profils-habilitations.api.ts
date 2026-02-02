import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { buildHttpParams } from '@shared/utils/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { profilsHabilitationsCreateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-create-api.dto';
import { ProfilsHabilitationsFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-filter-api.dto';
import { ProfilsHabilitationsResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-response-api.dto';
import { profilsHabilitationsUpdateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-update-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class ProfilsHabilitationsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: ProfilsHabilitationsFilterApiDto,
        page: string
    ): Observable<ProfilsHabilitationsResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<ProfilsHabilitationsResponseApiDto>(url, {
            params,
        });
    }

    create(
        apiDto: profilsHabilitationsCreateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(
        apiDto: profilsHabilitationsUpdateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/${id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/${id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    delete(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/${id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
