import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { AgentEndpoint } from '../constants/agent-endpoints.constant';
import {
    AgentDeleteResponseDto,
    AgentDisableResponseDto,
    AgentEnableResponseDto,
    AgentResponseDto,
    AgentStoreRequestDto,
    AgentUpdateRequestDto,
    AssignRequestDto,
    ReassignRequestDto,
    RemoveRequestDto,
    TenantLibreDto,
} from '../dtos/agent-response.dto';

@Injectable({
    providedIn: 'root',
})
export class AgentApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchAgents(payload: Record<string, string>): Observable<AgentResponseDto> {
        const url = `${this.baseUrl}${AgentEndpoint.AGENTS}`;

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

        return this.http.post<AgentResponseDto>(url, payload, { params });
    }

    storeAgent(payload: AgentStoreRequestDto): Observable<AgentResponseDto> {
        const url = `${this.baseUrl}${AgentEndpoint.STORE}`;
        return this.http.post<AgentResponseDto>(url, payload);
    }

    updateAgent(payload: AgentUpdateRequestDto): Observable<AgentResponseDto> {
        const url = `${this.baseUrl}${AgentEndpoint.UPDATE}`;
        return this.http.post<AgentResponseDto>(url, payload);
    }

    deleteAgent(id: string): Observable<AgentDeleteResponseDto> {
        const url = `${this.baseUrl}${AgentEndpoint.DELETE.replace('{id}', id)}`;
        return this.http.delete<AgentDeleteResponseDto>(url);
    }

    enableAgent(id: string): Observable<AgentEnableResponseDto> {
        const url = `${this.baseUrl}${AgentEndpoint.ENABLE.replace('{id}', id)}`;
        return this.http.post<AgentEnableResponseDto>(url, {});
    }

    disableAgent(id: string): Observable<AgentDisableResponseDto> {
        const url = `${this.baseUrl}${AgentEndpoint.DISABLE.replace('{id}', id)}`;
        return this.http.post<AgentDisableResponseDto>(url, {});
    }

    getFreeTenants(): Observable<{
        error: boolean;
        message: string;
        data: TenantLibreDto[];
    }> {
        const url = `${this.baseUrl}${AgentEndpoint.TENANTS_LIBRES}`;
        return this.http.get<{
            error: boolean;
            message: string;
            data: TenantLibreDto[];
        }>(url);
    }

    assignTenants(payload: AssignRequestDto): Observable<void> {
        const url = `${this.baseUrl}${AgentEndpoint.TENANTS_AFFECTATION}`;
        return this.http.post<void>(url, payload);
    }

    reassignTenants(payload: ReassignRequestDto): Observable<void> {
        const url = `${this.baseUrl}${AgentEndpoint.TENANTS_REASSIGNATION}`;
        return this.http.post<void>(url, payload);
    }

    removeTenants(payload: RemoveRequestDto): Observable<void> {
        const url = `${this.baseUrl}${AgentEndpoint.TENANTS_RETRAIT}`;
        return this.http.post<void>(url, payload);
    }
}
