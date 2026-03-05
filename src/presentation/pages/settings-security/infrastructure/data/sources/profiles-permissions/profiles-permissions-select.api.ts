import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsSelectResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-select-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(): Observable<ProfilesPermissionsSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/profiles`;
        return this.http.get<ProfilesPermissionsSelectResponseApiDto>(url);
    }
}
