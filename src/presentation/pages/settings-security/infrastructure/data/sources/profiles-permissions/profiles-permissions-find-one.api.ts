import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsFindOneFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-filter-api.dto';
import { ProfilesPermissionsFindOneResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-response-api.dto';
import { SETTINGS_SECURITY_LOGS_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_LOGS_BASE_URL);

    readAll(
        dto?: ProfilesPermissionsFindOneFilterApiDto
    ): Observable<ProfilesPermissionsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto?.id}`;
        return this.http.get<ProfilesPermissionsFindOneResponseApiDto>(url);
    }
}
