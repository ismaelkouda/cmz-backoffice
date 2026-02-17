// import { HttpClient } from '@angular/common/http';
// import { Inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { AgentsPerformancesFindOneFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/agents-performances/agents-performances-findone-filter-api.dto';
// import { AgentsPerformancesFindOneResponseApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/agents-performances/agents-performances-findone-response-api.dto';
// import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';
// import { TEAM_ORGANIZATION_ENDPOINTS } from '@presentation/pages/team-organization/infrastructure/api/team-organization.endpoints';

// @Injectable({ providedIn: 'root' })
// export class AgentsPerformancesFindOneApi {
//     constructor(
//         private readonly http: HttpClient,
//         @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
//     ) {}

//     readAll(
//         filter: AgentsPerformancesFindOneFilterApiDto
//     ): Observable<AgentsPerformancesFindOneResponseApiDto> {
//         const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.AGENTS_PERFORMANCES}/${filter.id}`;
//         return this.http.get<AgentsPerformancesFindOneResponseApiDto>(url);
//     }
// }
