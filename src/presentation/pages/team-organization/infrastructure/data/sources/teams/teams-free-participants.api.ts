// import { HttpClient } from '@angular/common/http';
// import { Inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
// import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

// import { TeamsFreeParticipantsAssignApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-assign-api.dto';
// import { TeamsFreeParticipantsResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-free-participants-response-api.dto';
// import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
// import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';

// @Injectable({ providedIn: 'root' })
// export class TeamsFreeParticipantsApi {
//     constructor(
//         private readonly http: HttpClient,
//         @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
//     ) {}

//     readAll(page: string): Observable<TeamsFreeParticipantsResponseApiDto> {
//         const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}?page=${page}`;

//         return this.http.get<TeamsFreeParticipantsResponseApiDto>(url);
//     }

//     assign(
//         dto: TeamsFreeParticipantsAssignApiDto
//     ): Observable<SimpleResponseDto<void>> {
//         const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/assign`;
//         const payload = buildHttpPayload(dto, []);
//         return this.http.post<SimpleResponseDto<void>>(url, payload);
//     }
// }
