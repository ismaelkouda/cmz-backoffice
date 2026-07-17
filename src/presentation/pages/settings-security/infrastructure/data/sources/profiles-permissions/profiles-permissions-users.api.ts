import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsUsersAssignApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-assign-api.dto';
import { ProfilesPermissionsUsersFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-filter-api.dto';
import { ProfilesPermissionsUsersReassignApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-reassign-api.dto';
import { ProfilesPermissionsUsersRemoveApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-remove-api.dto';
import { ProfilesPermissionsUsersResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-response-api.dto';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    readAll(
        dto: ProfilesPermissionsUsersFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<ProfilesPermissionsUsersResponseApiDto> {
        const { uniq_id, ...filterParams } = dto;
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${uniq_id}/users?page=${page}`;
        const params = buildHttpParams(filterParams, { skipEmptyString: true });

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ProfilesPermissionsUsersResponseApiDto>(url, {
            params,
            context,
        });
    }

    assign(
        dto: ProfilesPermissionsUsersAssignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto.uniq_id}/affect-users`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    reassign(
        dto: ProfilesPermissionsUsersReassignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto.uniq_id}/reaffect-users`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    remove(
        dto: ProfilesPermissionsUsersRemoveApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto.uniq_id}/remove-users`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }
}
