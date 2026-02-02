import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EndPointType } from '@shared/domain/types/end-point.types';
import { EnvService } from '@shared/services/env.service';
import { buildHttpPayload } from '@shared/utils/utils/build-http-payload.util';

import { ManagementEntity } from '../../domain/entities/management/management.entity';
import { ManagementRequestDto } from '../dtos/management/management-request.dto';
import { MANAGEMENT_ENDPOINTS } from '../endpoint/management-endpoint';

@Injectable({ providedIn: 'root' })
export class ManagementApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchTake(
        payload: ManagementRequestDto,
        endPointType: EndPointType
    ): Observable<SimpleResponseDto<ManagementEntity>> {
        let url: string;
        switch (endPointType) {
            case 'requests':
                url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.TAKE_QUALIFICATION.replace('{id}', payload.uniq_id)}`;
                break;

            case 'reports-processing':
                url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.TAKE_PROCESSING.replace('{id}', payload.uniq_id)}`;
                break;

            case 'reports-finalization':
                url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.TAKE_FINALIZATION.replace('{id}', payload.uniq_id)}`;
                break;

            default:
                throw new Error('Endpoint non defini');
                break;
        }

        const body = buildHttpPayload(payload, ['reason']);

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, body);
    }

    fetchApprove(
        payload: ManagementRequestDto,
        endPointType: EndPointType
    ): Observable<SimpleResponseDto<ManagementEntity>> {
        let url: string;
        switch (endPointType) {
            case 'requests':
                url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.APPROVE_QUALIFICATION.replace('{id}', payload.uniq_id)}`;
                break;

            case 'reports-processing':
                url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.APPROVE_PROCESSING.replace('{id}', payload.uniq_id)}`;
                break;

            case 'reports-finalization':
                url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.FINALIZE.replace('{id}', payload.uniq_id)}`;
                break;

            default:
                throw new Error('Endpoint non defini');
                break;
        }
        const body = buildHttpPayload(payload, ['uniq_id', 'reason']);

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, body);
    }

    fetchReject(
        payload: ManagementRequestDto,
        endPointType: EndPointType
    ): Observable<SimpleResponseDto<ManagementEntity>> {
        let url: string;
        switch (endPointType) {
            case 'requests':
                url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.REJECT_QUALIFICATION.replace('{id}', payload.uniq_id)}`;
                break;

            case 'reports-processing':
                url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.REJECT_PROCESSING.replace('{id}', payload.uniq_id)}`;
                break;

            default:
                throw new Error('Endpoint non defini');
                break;
        }
        const body = buildHttpPayload(payload, ['uniq_id']);

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, body);
    }

    fetchProcess(
        payload: ManagementRequestDto
    ): Observable<SimpleResponseDto<ManagementEntity>> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.PROCESS.replace('{id}', payload.uniq_id)}`;
        const body = buildHttpPayload(payload, ['uniq_id', 'reason']);

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, body);
    }

    fetchFinalize(
        payload: ManagementRequestDto
    ): Observable<SimpleResponseDto<ManagementEntity>> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.FINALIZE.replace('{id}', payload.uniq_id)}`;
        const body = buildHttpPayload(payload, ['uniq_id']);

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, body);
    }
}
