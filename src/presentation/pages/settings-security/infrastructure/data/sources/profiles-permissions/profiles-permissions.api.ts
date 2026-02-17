import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';

import { ProfilesPermissionsCreateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-create-api.dto';
import { ProfilesPermissionsFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-filter-api.dto';
import { ProfilesPermissionsResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-response-api.dto';
import { ProfilesPermissionsUpdateApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-update-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

import { ProfilesPermissionsDeleteApiDto } from '../../../api/dto/profiles-permissions/profiles-permissions-delete-api.dto';
import { ProfilesPermissionsDisableApiDto } from '../../../api/dto/profiles-permissions/profiles-permissions-disable-api.dto';
import { ProfilesPermissionsEnableApiDto } from '../../../api/dto/profiles-permissions/profiles-permissions-enable-api.dto';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: ProfilesPermissionsFilterApiDto,
        page: string
    ): Observable<ProfilesPermissionsResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<ProfilesPermissionsResponseApiDto>(url, {
            params,
        });
    }

    create(
        dto: ProfilesPermissionsCreateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/store`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(
        dto: ProfilesPermissionsUpdateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto.id}/update`;
        const payload = buildHttpPayload(dto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    enable(
        dto: ProfilesPermissionsEnableApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto.uniq_id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(
        dto: ProfilesPermissionsDisableApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto.uniq_id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    delete(
        dto: ProfilesPermissionsDeleteApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/${dto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
