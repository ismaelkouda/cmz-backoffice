import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-permissions-api.dto';
import { SETTINGS_SECURITY_LOGS_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_LOGS_BASE_URL)
        private readonly baseUrl: string
    ) {}

    execute(): Observable<ProfilesPermissionsPermissionsResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/get-permissions-model`;
        return this.http.get<ProfilesPermissionsPermissionsResponseApiDto>(url);
    }
}
