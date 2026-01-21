import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AccessLogsFilterVo } from "@presentation/pages/settings-security/core/domain/value-objects/access-logs-filter.vo";
import { AccessLogsFilterApiDto } from "@presentation/pages/settings-security/infrastructure/api/dtos/access-logs/access-logs-filter-api.dto";
import { AccessLogsResponseApiDto } from "@presentation/pages/settings-security/infrastructure/api/dtos/access-logs/access-logs-response-api.dto";
import { SETTINGS_SECURITY_BASE_URL } from "@presentation/pages/settings-security/infrastructure/api/settings-security.base-url";
import { SETTINGS_SECURITY_ENDPOINTS } from "@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })

export class AccessLogsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) { }

    readAll(filter: AccessLogsFilterVo, page: string): Observable<AccessLogsResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.ACCESS_LOGS}?page=${page}`;

        const params = this.createHttpParams(filter);

        return this.http.get<AccessLogsResponseApiDto>(url, { params });
    }

    private createHttpParams(payload: AccessLogsFilterApiDto): HttpParams {
        let params = new HttpParams();

        if (payload) {
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (value instanceof Date) {
                        params = params.set(key, value.toISOString());
                    } else {
                        params = params.set(key, String(value));
                    }
                }
            });
        }

        return params;
    }
}
