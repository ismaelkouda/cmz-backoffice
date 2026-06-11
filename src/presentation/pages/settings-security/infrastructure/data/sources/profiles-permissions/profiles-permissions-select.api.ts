import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsSelectResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-select-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_BASE_URL);

    readAll(
        options?: FetchOptions
    ): Observable<ProfilesPermissionsSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/select-field`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ProfilesPermissionsSelectResponseApiDto>(url, {
            context,
        });
    }
}
