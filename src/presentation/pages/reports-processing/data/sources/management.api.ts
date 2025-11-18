import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { ManagementRequestDto } from '../dtos/management/management-request.dto';
import { MANAGEMENT_ENDPOINTS } from '../endpoint/management-endpoint';

@Injectable({ providedIn: 'root' })
export class ManagementApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchTake(payload: ManagementRequestDto): Observable<SimpleResponseDto> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.TAKE.replace('{id}', payload.uniq_id)}`;
        const { uniq_id, ...bodyParams } = payload;

        const paramsObject = Object.entries(bodyParams).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        return this.http.post<SimpleResponseDto>(url, paramsObject);
    }

    fetchApprove(payload: ManagementRequestDto): Observable<SimpleResponseDto> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.APPROVE.replace('{id}', payload.uniq_id)}`;
        const { uniq_id, reason, ...bodyParams } = payload;

        const paramsObject = Object.entries(bodyParams).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        return this.http.post<SimpleResponseDto>(url, paramsObject);
    }

    fetchReject(payload: ManagementRequestDto): Observable<SimpleResponseDto> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.REJECT.replace('{id}', payload.uniq_id)}`;
        const { uniq_id, ...bodyParams } = payload;

        const paramsObject = Object.entries(bodyParams).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        return this.http.post<SimpleResponseDto>(url, paramsObject);
    }

    fetchProcess(payload: ManagementRequestDto): Observable<SimpleResponseDto> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.PROCESS.replace('{id}', payload.uniq_id)}`;
        const { uniq_id, reason, ...bodyParams } = payload;

        const paramsObject = Object.entries(bodyParams).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        return this.http.post<SimpleResponseDto>(url, paramsObject);
    }

    fetchFinalized(
        payload: ManagementRequestDto
    ): Observable<SimpleResponseDto> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.FINALIZE.replace('{id}', payload.uniq_id)}`;
        const { uniq_id, ...bodyParams } = payload;

        const paramsObject = Object.entries(bodyParams).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        return this.http.post<SimpleResponseDto>(url, paramsObject);
    }
}
