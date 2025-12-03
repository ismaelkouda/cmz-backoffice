import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { UsersStorePayloadEntity } from '../../domain/entities/users/users-store-payload.entity';
import { UsersUpdatePayloadEntity } from '../../domain/entities/users/users-update-payload.entity';
import { UsersEntity } from '../../domain/entities/users/users.entity';
import { UserEndpoint } from '../constants/user-endpoints.constant';
import { UserRequestDto } from '../dtos/user-request.dto';
import {
    UserResponseDto
} from '../dtos/user-response.dto';

@Injectable({
    providedIn: 'root',
})
export class UserApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) { }

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

    storeUser(payload: UsersStorePayloadEntity): Observable<UsersEntity> {
        const url = `${this.baseUrl}${UserEndpoint.STORE}`;
        return this.http.post<UsersEntity>(url, payload);
    }

    updateUser(payload: UsersUpdatePayloadEntity): Observable<UsersEntity> {
        const url = `${this.baseUrl}${UserEndpoint.UPDATE}`;
        return this.http.put<UsersEntity>(url, payload);
    }

    deleteUser(id: string): Observable<void> {
        const url = `${this.baseUrl}${UserEndpoint.DELETE}`;
        return this.http.delete<void>(url, {
            params: { id },
        });
    }

    enableUser(id: string): Observable<void> {
        const url = `${this.baseUrl}${UserEndpoint.ENABLE}`;
        return this.http.post<void>(url, { id });
    }

    disableUser(id: string): Observable<void> {
        const url = `${this.baseUrl}${UserEndpoint.DISABLE}`;
        return this.http.post<void>(url, { id });
    }
}
