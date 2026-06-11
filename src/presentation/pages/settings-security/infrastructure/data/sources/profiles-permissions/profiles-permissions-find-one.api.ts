import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsFindOneFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-filter-api.dto';
import { ProfilesPermissionsFindOneResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-response-api.dto';
import { SETTINGS_SECURITY_LOGS_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_LOGS_BASE_URL);

    readAll(
        dto?: ProfilesPermissionsFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<ProfilesPermissionsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto?.id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ProfilesPermissionsFindOneResponseApiDto>(url, {
            context,
        });
    }
}
