import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/utils/utils/build-http-params.utils';

import { AccessLogsFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/access-logs/access-logs-filter-api.dto';
import { AccessLogsResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/access-logs/access-logs-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class AccessLogsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: AccessLogsFilterApiDto,
        page: string
    ): Observable<AccessLogsResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.ACCESS_LOGS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<AccessLogsResponseApiDto>(url, { params });
    }
}
