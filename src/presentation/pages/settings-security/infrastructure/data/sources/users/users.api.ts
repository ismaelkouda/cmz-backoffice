import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { buildHttpParams } from '@shared/utils/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { UsersFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/users-filter-api.dto';
import { UsersResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/users-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

import { UsersCreateApiDto } from '../../../api/dtos/users/users-create-api.dto';
import { UsersUpdateApiDto } from '../../../api/dtos/users/users-update-api.dto';

@Injectable({ providedIn: 'root' })
export class UsersApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

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

    delete(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/${id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/${id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/${id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
