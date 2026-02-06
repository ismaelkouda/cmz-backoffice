import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsersFindOneFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/users-findone-filter-api.dto';
import { UsersFindOneResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/users-findone-response-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class UsersFindonApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: UsersFindOneFilterApiDto
    ): Observable<UsersFindOneResponseApiDto> {
        const params = filter?.id ? `/${filter.id}` : '';
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/${params}`;
        return this.http.get<UsersFindOneResponseApiDto>(url);
    }
}
