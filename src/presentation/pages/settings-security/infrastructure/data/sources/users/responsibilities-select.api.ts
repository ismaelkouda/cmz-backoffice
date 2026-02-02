import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

import { ResponsibilitiesSelectResponseApiDto } from '../../../api/dtos/users/responsibilities-select-api.dto';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(): Observable<ResponsibilitiesSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/responsibilities`;
        return this.http.get<ResponsibilitiesSelectResponseApiDto>(url);
    }
}
