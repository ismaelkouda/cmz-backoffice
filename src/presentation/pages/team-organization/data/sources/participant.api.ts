import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { ParticipantEndpoint } from '../constants/participant-endpoints.constant';
import { ParticipantRequestDto } from '../dtos/participant-request.dto';
import {
    ParticipantDeleteResponseDto,
    ParticipantDisableResponseDto,
    ParticipantEnableResponseDto,
    ParticipantResponseDto,
    ParticipantStoreRequestDto,
    ParticipantUpdateRequestDto,
    RolesResponseDto,
} from '../dtos/participant-response.dto';

@Injectable({
    providedIn: 'root',
})
export class ParticipantApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchParticipants(
        payload: ParticipantRequestDto
    ): Observable<ParticipantResponseDto> {
        const url = `${this.baseUrl}${ParticipantEndpoint.PARTICIPANTS}`;

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

        return this.http.post<ParticipantResponseDto>(url, payload, { params });
    }

    storeParticipant(
        payload: ParticipantStoreRequestDto
    ): Observable<ParticipantResponseDto> {
        const url = `${this.baseUrl}${ParticipantEndpoint.STORE}`;
        return this.http.post<ParticipantResponseDto>(url, payload);
    }

    updateParticipant(
        payload: ParticipantUpdateRequestDto
    ): Observable<ParticipantResponseDto> {
        const url = `${this.baseUrl}${ParticipantEndpoint.UPDATE}`;
        return this.http.post<ParticipantResponseDto>(url, payload);
    }

    deleteParticipant(id: string): Observable<ParticipantDeleteResponseDto> {
        const url = `${this.baseUrl}${ParticipantEndpoint.DELETE.replace('{id}', id)}`;
        return this.http.delete<ParticipantDeleteResponseDto>(url);
    }

    enableParticipant(id: string): Observable<ParticipantEnableResponseDto> {
        const url = `${this.baseUrl}${ParticipantEndpoint.ENABLE.replace('{id}', id)}`;
        return this.http.post<ParticipantEnableResponseDto>(url, {});
    }

    disableParticipant(id: string): Observable<ParticipantDisableResponseDto> {
        const url = `${this.baseUrl}${ParticipantEndpoint.DISABLE.replace('{id}', id)}`;
        return this.http.post<ParticipantDisableResponseDto>(url, {});
    }

    getRoles(): Observable<RolesResponseDto> {
        const url = `${this.baseUrl}${ParticipantEndpoint.ROLES}`;
        return this.http.post<RolesResponseDto>(url, {});
    }
}
