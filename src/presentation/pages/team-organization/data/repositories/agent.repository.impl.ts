import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AgentIa } from '../../domain/entities/agent-ia.entity';
import { AgentRepository } from '../../domain/repositories/agent.repository';
import { AgentFilter } from '../../domain/value-objects/agent-filter.vo';
import {
    AgentDeleteResponseDto,
    AgentDisableResponseDto,
    AgentEnableResponseDto,
    AgentStoreRequestDto,
    AgentUpdateRequestDto,
    AssignRequestDto,
    ReassignRequestDto,
    RemoveRequestDto,
    TenantLibreDto,
} from '../dtos/agent-response.dto';
import { AgentMapper } from '../mappers/agent.mapper';
import { AgentApi } from '../sources/agent.api';

@Injectable({
    providedIn: 'root',
})
export class AgentRepositoryImpl extends AgentRepository {
    constructor(
        private readonly agentApi: AgentApi,
        private readonly agentMapper: AgentMapper
    ) {
        super();
    }

    fetchAgents(filter: AgentFilter): Observable<AgentIa[]> {
        return this.agentApi
            .fetchAgents(filter.toDto())
            .pipe(map((response) => this.agentMapper.mapFromDto(response)));
    }

    storeAgent(payload: AgentStoreRequestDto): Observable<AgentIa> {
        return this.agentApi.storeAgent(payload).pipe(
            map((response) => {
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    return this.agentMapper.mapItemFromDto(response.data[0]);
                }
                throw new Error('Invalid response from store agent');
            })
        );
    }

    updateAgent(payload: AgentUpdateRequestDto): Observable<AgentIa> {
        return this.agentApi.updateAgent(payload).pipe(
            map((response) => {
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    return this.agentMapper.mapItemFromDto(response.data[0]);
                }
                throw new Error('Invalid response from update agent');
            })
        );
    }

    deleteAgent(id: string): Observable<AgentDeleteResponseDto> {
        return this.agentApi.deleteAgent(id);
    }

    enableAgent(id: string): Observable<AgentEnableResponseDto> {
        return this.agentApi.enableAgent(id);
    }

    disableAgent(id: string): Observable<AgentDisableResponseDto> {
        return this.agentApi.disableAgent(id);
    }

    getFreeTenants(): Observable<TenantLibreDto[]> {
        return this.agentApi.getFreeTenants().pipe(
            map((response) => response.data || [])
        );
    }

    assignTenants(payload: AssignRequestDto): Observable<void> {
        return this.agentApi.assignTenants(payload);
    }

    reassignTenants(payload: ReassignRequestDto): Observable<void> {
        return this.agentApi.reassignTenants(payload);
    }

    removeTenants(payload: RemoveRequestDto): Observable<void> {
        return this.agentApi.removeTenants(payload);
    }
}

