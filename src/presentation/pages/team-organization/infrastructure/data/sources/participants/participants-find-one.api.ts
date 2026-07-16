import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { ParticipantsFindOneFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-find-one-filter-api.dto';
import { ParticipantsFindOneResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-find-one-response-api.dto';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_URL);

    read(
        filter?: ParticipantsFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<ParticipantsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.PARTICIPANTS}/${filter?.id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ParticipantsFindOneResponseApiDto>(url, {
            context,
        });
    }
}
