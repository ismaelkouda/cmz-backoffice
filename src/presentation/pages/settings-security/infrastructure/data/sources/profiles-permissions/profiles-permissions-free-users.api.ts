import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsFreeUsersAssignApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-free-users-assign-api.dto';
import { ProfilesPermissionsFreeUsersResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-free-users-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFreeUsersApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_BASE_URL);

    readAll(
        page: string,
        options?: FetchOptions
    ): Observable<ProfilesPermissionsFreeUsersResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}?page=${page}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ProfilesPermissionsFreeUsersResponseApiDto>(url, {
            context,
        });
    }

    assign(
        dto: ProfilesPermissionsFreeUsersAssignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/assign`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
