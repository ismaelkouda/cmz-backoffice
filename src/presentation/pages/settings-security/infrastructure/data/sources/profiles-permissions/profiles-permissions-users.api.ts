import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';

import { ProfilesPermissionsUsersAssignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-assign-api.dto';
import { ProfilesPermissionsUsersFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-filter-api.dto';
import { ProfilesPermissionsUsersReassignApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-reassign-api.dto';
import { ProfilesPermissionsUsersRemoveApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-remove-api.dto';
import { ProfilesPermissionsUsersResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: ProfilesPermissionsUsersFilterApiDto,
        page: string
    ): Observable<ProfilesPermissionsUsersResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<ProfilesPermissionsUsersResponseApiDto>(url, {
            params,
        });
    }

    reassign(
        dto: ProfilesPermissionsUsersReassignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/reassign`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    assign(
        dto: ProfilesPermissionsUsersAssignApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/assign`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    remove(
        dto: ProfilesPermissionsUsersRemoveApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/remove`;
        const payload = buildHttpPayload(dto, ['profile_user_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
