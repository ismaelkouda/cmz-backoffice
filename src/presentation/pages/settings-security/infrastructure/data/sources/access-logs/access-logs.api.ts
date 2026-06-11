import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { AccessLogsFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/access-logs/access-logs-filter-api.dto';
import { AccessLogsResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/access-logs/access-logs-response-api.dto';
import { SETTINGS_SECURITY_LOGS_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccessLogsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_LOGS_BASE_URL);

    readAll(
        filter: AccessLogsFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<AccessLogsResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.ACCESS_LOGS}?page=${page}`;

        const params = buildHttpParams(filter);

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<AccessLogsResponseApiDto>(url, {
            params,
            context,
        });
    }
}
