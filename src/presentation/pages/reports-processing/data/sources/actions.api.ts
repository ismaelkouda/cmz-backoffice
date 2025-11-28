import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { ActionsCreateRequestDto } from '../dtos/actions/actions-create-request.dto';
import { ActionsRequestDto } from '../dtos/actions/actions-request.dto';
import { ActionsResponseDto } from '../dtos/actions/actions-response.dto';
import { ACTIONS_ENDPOINTS } from '../endpoint/actions-endpoints';

@Injectable({ providedIn: 'root' })
export class ActionsApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchActions(
        payload: ActionsRequestDto,
        page: string
    ): Observable<ActionsResponseDto> {
        const url = `${this.baseUrl}${ACTIONS_ENDPOINTS.ACTIONS.replace('{page}', page)}`;
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

        return this.http.get<ActionsResponseDto>(url, { params });
    }

    createAction(
        payload: ActionsCreateRequestDto
    ): Observable<SimpleResponseDto<{ id: string }>> {
        const url = `${this.baseUrl}${ACTIONS_ENDPOINTS.CREATE}`;
        console.log("payload", payload)
        return this.http.post<SimpleResponseDto<{ id: string }>>(url, payload);
    }

    updateAction(
        id: string,
        payload: ActionsCreateRequestDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ACTIONS_ENDPOINTS.UPDATE.replace('{id}', id)}`;
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }

    deleteAction(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ACTIONS_ENDPOINTS.DELETE.replace('{id}', id)}`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
