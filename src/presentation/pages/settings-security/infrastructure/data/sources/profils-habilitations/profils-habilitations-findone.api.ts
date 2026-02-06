import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilsHabilitationsFindOneFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-findone-filter-api.dto';
import { ProfilsHabilitationsFindOneResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-findone-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class ProfilsHabilitationsFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter?: ProfilsHabilitationsFindOneFilterApiDto
    ): Observable<ProfilsHabilitationsFindOneResponseApiDto> {
        const prams = filter?.id ? `/${filter.id}` : '';
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_HABILITATIONS}/get-permissions-model${prams}`;
        return this.http.get<ProfilsHabilitationsFindOneResponseApiDto>(url);
    }
}
