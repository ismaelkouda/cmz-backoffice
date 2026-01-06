import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { TeamEndpoint } from '../constants/team-endpoints.constant';
import { TeamRequestDto } from '../dtos/team-request.dto';
import {
    AssignRequestDto,
    ParticipantAffectedResponseDto,
    ParticipantLibreDto,
    ReassignRequestDto,
    RemoveRequestDto,
    TeamDeleteResponseDto,
    TeamDisableResponseDto,
    TeamEnableResponseDto,
    TeamResponseDto,
    TeamStoreRequestDto,
    TeamUpdateRequestDto,
    TenantLibreDto,
    TenantResponseDto,
} from '../dtos/team-response.dto';

@Injectable({
    providedIn: 'root',
})
export class TeamApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchTeams(payload: TeamRequestDto): Observable<TeamResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.TEAMS}`;

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

        return this.http.post<TeamResponseDto>(url, payload, { params });
    }

    storeTeam(payload: TeamStoreRequestDto): Observable<TeamResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.STORE}`;
        return this.http.post<TeamResponseDto>(url, payload);
    }

    updateTeam(payload: TeamUpdateRequestDto): Observable<TeamResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.UPDATE}`;
        return this.http.post<TeamResponseDto>(url, payload);
    }

    deleteTeam(id: string): Observable<TeamDeleteResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.DELETE.replace('{id}', id)}`;
        return this.http.delete<TeamDeleteResponseDto>(url);
    }

    enableTeam(id: string): Observable<TeamEnableResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.ENABLE.replace('{id}', id)}`;
        return this.http.post<TeamEnableResponseDto>(url, {});
    }

    disableTeam(id: string): Observable<TeamDisableResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.DISABLE.replace('{id}', id)}`;
        return this.http.post<TeamDisableResponseDto>(url, {});
    }

    getFreeTenants(): Observable<{
        error: boolean;
        message: string;
        data: TenantLibreDto[];
    }> {
        const url = `${this.baseUrl}${TeamEndpoint.TENANTS_LIBRES}`;
        return this.http.get<{
            error: boolean;
            message: string;
            data: TenantLibreDto[];
        }>(url);
    }

    getFreeParticipants(role: string): Observable<{
        error: boolean;
        message: string;
        data: ParticipantLibreDto[];
    }> {
        const url = `${this.baseUrl}${TeamEndpoint.PARTICIPANTS_LIBRES.replace('{role}', role)}`;
        return this.http.get<{
            error: boolean;
            message: string;
            data: ParticipantLibreDto[];
        }>(url);
    }

    assignTenants(payload: AssignRequestDto): Observable<void> {
        const url = `${this.baseUrl}${TeamEndpoint.TENANTS_AFFECTATION}`;
        return this.http.post<void>(url, payload);
    }

    assignParticipants(payload: AssignRequestDto): Observable<void> {
        const url = `${this.baseUrl}${TeamEndpoint.PARTICIPANTS_AFFECTATION}`;
        return this.http.post<void>(url, payload);
    }

    reassignTenants(payload: ReassignRequestDto): Observable<void> {
        const url = `${this.baseUrl}${TeamEndpoint.TENANTS_REASSIGNATION}`;
        return this.http.post<void>(url, payload);
    }

    reassignParticipants(payload: ReassignRequestDto): Observable<void> {
        const url = `${this.baseUrl}${TeamEndpoint.PARTICIPANTS_REASSIGNATION}`;
        return this.http.post<void>(url, payload);
    }

    removeTenants(payload: RemoveRequestDto): Observable<void> {
        const url = `${this.baseUrl}${TeamEndpoint.TENANTS_RETRAIT}`;
        return this.http.post<void>(url, payload);
    }

    removeParticipants(payload: RemoveRequestDto): Observable<void> {
        const url = `${this.baseUrl}${TeamEndpoint.PARTICIPANTS_RETRAIT}`;
        return this.http.post<void>(url, payload);
    }

    getTenantsByTeam(equipe_id: string): Observable<TenantResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.TENANTS}`;
        return this.http.post<TenantResponseDto>(url, { equipe_id });
    }

    getParticipantsByTeam(
        equipe_id: string
    ): Observable<ParticipantAffectedResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.PARTICIPANTS}`;
        return this.http.post<ParticipantAffectedResponseDto>(url, {
            equipe_id,
        });
    }

    getTeamsWithoutTenant(equipe_id: string): Observable<TeamResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.TEAMS}`;
        return this.http.post<TeamResponseDto>(url, {});
    }

    getTeamsWithoutParticipant(equipe_id: string): Observable<TeamResponseDto> {
        const url = `${this.baseUrl}${TeamEndpoint.TEAMS}`;
        return this.http.post<TeamResponseDto>(url, {});
    }
}
