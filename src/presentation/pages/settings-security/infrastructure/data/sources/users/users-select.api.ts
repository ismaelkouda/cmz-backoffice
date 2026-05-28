import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UsersSelectResponseApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-select-api.dto';
import { SETTINGS_SECURITY_BASE_URL } from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_SECURITY_BASE_URL);

    readAll(): Observable<UsersSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.PROFILES_PERMISSIONS}/free-users`;
        return this.http.get<UsersSelectResponseApiDto>(url);
    }
}
