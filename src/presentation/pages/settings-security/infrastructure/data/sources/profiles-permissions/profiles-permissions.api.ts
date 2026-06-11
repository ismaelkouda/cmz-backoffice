import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsCreateApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-create-api.dto';
import { ProfilesPermissionsFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-filter-api.dto';
import { ProfilesPermissionsResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-response-api.dto';
import { ProfilesPermissionsUpdateApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-update-api.dto';
import { SETTINGS_SECURITY_LOGS_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

import { ProfilesPermissionsDeleteApiDto } from '../../../api/dto/profiles-permissions/profiles-permissions-delete-api.dto';
import { ProfilesPermissionsDisableApiDto } from '../../../api/dto/profiles-permissions/profiles-permissions-disable-api.dto';
import { ProfilesPermissionsEnableApiDto } from '../../../api/dto/profiles-permissions/profiles-permissions-enable-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_LOGS_BASE_URL);

    readAll(
        filter: ProfilesPermissionsFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<ProfilesPermissionsResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}?page=${page}`;

        const params = buildHttpParams(filter);

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ProfilesPermissionsResponseApiDto>(url, {
            params,
            context,
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
