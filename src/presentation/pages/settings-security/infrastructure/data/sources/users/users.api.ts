import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UsersCreateApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-create-api.dto';
import { UsersDeleteApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-delete-api.dto';
import { UsersDisableApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-disable-api.dto';
import { UsersEnableApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-enable-api.dto';
import { UsersFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-filter-api.dto';
import { UsersResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-response-api.dto';
import { UsersUpdateApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-update-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_BASE_URL);

    readAll(
        filter: UsersFilterApiDto,
        page: string
    ): Observable<UsersResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<UsersResponseApiDto>(url, {
            params,
        });
    }

    create(apiDto: UsersCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(apiDto: UsersUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(apiDto: UsersDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/${apiDto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(apiDto: UsersEnableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/${apiDto.uniq_id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(apiDto: UsersDisableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/${apiDto.uniq_id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
