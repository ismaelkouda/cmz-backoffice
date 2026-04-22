import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ParticipantsSelectResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-select-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: string | null
    ): Observable<ParticipantsSelectResponseApiDto> {
        const params = buildHttpParams({ role: filter });
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/free-members`;
        return this.http.get<ParticipantsSelectResponseApiDto>(url, {
            params,
        });
    }
}
