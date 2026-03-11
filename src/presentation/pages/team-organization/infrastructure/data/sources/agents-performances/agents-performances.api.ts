import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AgentsPerformancesFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-filter-api.dto';
import { AgentsPerformancesResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-response-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: AgentsPerformancesFilterApiDto,
        page: string
    ): Observable<AgentsPerformancesResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.AGENTS_PERFORMANCES}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<AgentsPerformancesResponseApiDto>(url, { params });
    }
}
