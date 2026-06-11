import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { AgentsPerformancesFindOneFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-find-one-filter-api.dto';
import { AgentsPerformancesFindOneResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-find-one-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(TEAM_ORGANIZATION_BASE_URL);

    execute(
        filter: AgentsPerformancesFindOneFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<AgentsPerformancesFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.AGENTS_PERFORMANCES}/${filter.uniq_id}?page=${page}`;
        const params = buildHttpParams(filter);

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<AgentsPerformancesFindOneResponseApiDto>(url, {
            params,
            context,
        });
    }
}
