import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { UserEndpoint } from '../constants/user-endpoints.constant';
import { UserRequestDto } from '../dtos/user-request.dto';
import {
    UserResponseDto,
    UserStoreRequestDto,
    UserUpdateRequestDto,
    UserDeleteResponseDto,
    UserEnableResponseDto,
    UserDisableResponseDto,
} from '../dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable({
    providedIn: 'root',
})
export class UserApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchUsers(
        payload: UserRequestDto,
        page: string
    ): Observable<UserResponseDto> {
        const url = `${this.baseUrl}${UserEndpoint.USERS.replace('{page}', page)}`;

        const paramsObject = Object.entries(payload ?? {}).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        const params =
            Object.keys(paramsObject).length > 0
                ? new HttpParams({ fromObject: paramsObject })
                : undefined;

        return this.http.get<UserResponseDto>(url, { params });
    }

    storeUser(payload: UserStoreRequestDto): Observable<User> {
        const url = `${this.baseUrl}${UserEndpoint.STORE}`;
        return this.http.post<User>(url, payload);
    }

    updateUser(payload: UserUpdateRequestDto): Observable<User> {
        const url = `${this.baseUrl}${UserEndpoint.UPDATE}`;
        return this.http.put<User>(url, payload);
    }

    deleteUser(id: string): Observable<UserDeleteResponseDto> {
        const url = `${this.baseUrl}${UserEndpoint.DELETE}`;
        return this.http.delete<UserDeleteResponseDto>(url, {
            params: { id },
        });
    }

    enableUser(id: string): Observable<UserEnableResponseDto> {
        const url = `${this.baseUrl}${UserEndpoint.ENABLE}`;
        return this.http.post<UserEnableResponseDto>(url, { id });
    }

    disableUser(id: string): Observable<UserDisableResponseDto> {
        const url = `${this.baseUrl}${UserEndpoint.DISABLE}`;
        return this.http.post<UserDisableResponseDto>(url, { id });
    }
}
