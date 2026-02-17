import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@presentation/pages/settings-security/infrastructure/api/settings-security.endpoints';

import { ProfilesSelectResponseApiDto } from '../../../api/dto/users/profiles-select-api.dto';

@Injectable({ providedIn: 'root' })
export class ProfilesSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(SETTINGS_SECURITY_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(): Observable<ProfilesSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/profiles`;
        return this.http.get<ProfilesSelectResponseApiDto>(url);
    }
}
