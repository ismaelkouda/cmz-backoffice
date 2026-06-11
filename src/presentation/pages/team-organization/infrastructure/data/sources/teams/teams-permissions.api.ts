import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { TeamsPermissionsResponseApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-permissions-api.dto';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { TEAM_ORGANIZATION_ENDPOINTS } from '@pages/team-organization/infrastructure/api/team-organization.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(TEAM_ORGANIZATION_BASE_URL);

    execute(
        options?: FetchOptions
    ): Observable<TeamsPermissionsResponseApiDto> {
        const url = `${this.baseUrl}${TEAM_ORGANIZATION_ENDPOINTS.TEAMS}/get-permissions-model`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<TeamsPermissionsResponseApiDto>(url, {
            context,
        });
    }
}
