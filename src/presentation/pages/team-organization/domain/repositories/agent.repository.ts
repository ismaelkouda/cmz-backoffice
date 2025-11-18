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
} from '@presentation/pages/team-organization/data/dtos/agent-response.dto';
import { Observable } from 'rxjs';
import { AgentIa } from '../entities/agent-ia.entity';
import { AgentFilter } from '../value-objects/agent-filter.vo';

export abstract class AgentRepository {
    abstract fetchAgents(
        filter: AgentFilter
    ): Observable<AgentIa[]>;

    abstract storeAgent(
        payload: AgentStoreRequestDto
    ): Observable<AgentIa>;

    abstract updateAgent(
        payload: AgentUpdateRequestDto
    ): Observable<AgentIa>;

    abstract deleteAgent(id: string): Observable<AgentDeleteResponseDto>;

    abstract enableAgent(id: string): Observable<AgentEnableResponseDto>;

    abstract disableAgent(id: string): Observable<AgentDisableResponseDto>;

    abstract getFreeTenants(): Observable<TenantLibreDto[]>;

    abstract assignTenants(payload: AssignRequestDto): Observable<void>;

    abstract reassignTenants(payload: ReassignRequestDto): Observable<void>;

    abstract removeTenants(payload: RemoveRequestDto): Observable<void>;
}

