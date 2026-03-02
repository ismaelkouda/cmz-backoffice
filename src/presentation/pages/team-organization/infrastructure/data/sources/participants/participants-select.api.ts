import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { ParticipantsSelectResponseApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/participants/participants-select-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@presentation/pages/team-organization/infrastructure/api/team-organization.endpoints';

@Injectable({ providedIn: 'root' })
export class ParticipantsSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(TEAM_ORGANIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: string | null
    ): Observable<ParticipantsSelectResponseApiDto> {
        console.log('filter: ', filter);
        const params = buildHttpParams({ role: filter });
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/members/select-field`;
        return this.http.get<ParticipantsSelectResponseApiDto>(url, {
            params,
        });
    }
}
