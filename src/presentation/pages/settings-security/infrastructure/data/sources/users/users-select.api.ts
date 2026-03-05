import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsersSelectResponseApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/users/users-select-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

@Injectable({ providedIn: 'root' })
export class UsersSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(): Observable<UsersSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/profiles`;
        return this.http.get<UsersSelectResponseApiDto>(url);
    }
}
