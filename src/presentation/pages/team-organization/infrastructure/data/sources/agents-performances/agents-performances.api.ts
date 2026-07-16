import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { AgentsPerformancesFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-filter-api.dto';
import { AgentsPerformancesResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-response-api.dto';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_URL);

    execute(
        filter: AgentsPerformancesFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<AgentsPerformancesResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.AGENTS_PERFORMANCES}?page=${page}`;

        const params = buildHttpParams(filter);

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<AgentsPerformancesResponseApiDto>(url, {
            params,
            context,
        });
    }
}
