import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ProfilesPermissionsSelectResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-select-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(): Observable<ProfilesPermissionsSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/select-field`;
        return this.http.get<ProfilesPermissionsSelectResponseApiDto>(url);
    }
}
