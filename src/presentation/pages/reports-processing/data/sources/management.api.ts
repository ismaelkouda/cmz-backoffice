import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
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
        const { uniq_id, ...bodyParams } = payload;

        const paramsObject = Object.entries(bodyParams).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, paramsObject);
    }

    fetchApprove(
        payload: ManagementRequestDto,
        endPointType: EndPointType
    ): Observable<SimpleResponseDto<ManagementEntity>> {
        console.log('JSON.stringify(paramsObject)', payload);
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
        const { uniq_id, reason, ...bodyParams } = payload;

        const paramsObject = Object.entries(bodyParams).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, paramsObject);
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
        const { uniq_id, ...bodyParams } = payload;

        const paramsObject = Object.entries(bodyParams).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, paramsObject);
    }

    fetchProcess(payload: ManagementRequestDto): Observable<SimpleResponseDto<ManagementEntity>> {
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

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, paramsObject);
    }

    fetchFinalize(
        payload: ManagementRequestDto
    ): Observable<SimpleResponseDto<ManagementEntity>> {
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

        return this.http.post<SimpleResponseDto<ManagementEntity>>(url, paramsObject);
    }
}
