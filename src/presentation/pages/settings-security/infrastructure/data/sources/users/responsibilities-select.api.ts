import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_SECURITY_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { Observable } from 'rxjs';

import { ResponsibilitiesSelectResponseApiDto } from '../../../api/dto/users/responsibilities-select-api.dto';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_BASE_URL);

    readAll(): Observable<ResponsibilitiesSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/responsibilities`;
        return this.http.get<ResponsibilitiesSelectResponseApiDto>(url);
    }
}
