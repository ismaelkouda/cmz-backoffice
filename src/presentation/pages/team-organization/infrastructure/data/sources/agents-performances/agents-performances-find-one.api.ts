import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AgentsPerformancesFindOneFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-find-one-filter-api.dto';
import { AgentsPerformancesFindOneResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-find-one-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(TEAM_ORGANIZATION_BASE_URL);

    execute(
        filter: AgentsPerformancesFindOneFilterApiDto,
        page: string
    ): Observable<AgentsPerformancesFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.AGENTS_PERFORMANCES}/${filter.uniq_id}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<AgentsPerformancesFindOneResponseApiDto>(url, {
            params,
        });
    }
}
