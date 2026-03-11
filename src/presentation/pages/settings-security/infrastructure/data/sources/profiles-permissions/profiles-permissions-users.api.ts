import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ProfilesPermissionsUsersAssignApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-assign-api.dto';
import { ProfilesPermissionsUsersFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-filter-api.dto';
import { ProfilesPermissionsUsersReassignApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-reassign-api.dto';
import { ProfilesPermissionsUsersRemoveApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-remove-api.dto';
import { ProfilesPermissionsUsersResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        dto: ProfilesPermissionsUsersFilterApiDto,
        page: string
    ): Observable<ProfilesPermissionsUsersResponseApiDto> {
        const { uniq_id, ...filterParams } = dto;
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${uniq_id}/users?page=${page}`;
        const params = buildHttpParams(filterParams, { skipEmptyString: true });
        return this.http.get<ProfilesPermissionsUsersResponseApiDto>(url, {
            params,
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
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto.uniq_id}/remove`;
        const payload = buildHttpPayload(dto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
