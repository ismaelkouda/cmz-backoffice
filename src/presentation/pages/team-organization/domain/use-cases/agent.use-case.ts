import { inject, Injectable } from '@angular/core';
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
import { AgentRepository } from '../repositories/agent.repository';
import { AgentFilter } from '../value-objects/agent-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchAgentsUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(filter: AgentFilter): Observable<AgentIa[]> {
        return this.agentRepository.fetchAgents(filter);
    }
}

@Injectable({
    providedIn: 'root',
})
export class StoreAgentUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(payload: AgentStoreRequestDto): Observable<AgentIa> {
        return this.agentRepository.storeAgent(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class UpdateAgentUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(payload: AgentUpdateRequestDto): Observable<AgentIa> {
        return this.agentRepository.updateAgent(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DeleteAgentUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(id: string): Observable<AgentDeleteResponseDto> {
        return this.agentRepository.deleteAgent(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class EnableAgentUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(id: string): Observable<AgentEnableResponseDto> {
        return this.agentRepository.enableAgent(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DisableAgentUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(id: string): Observable<AgentDisableResponseDto> {
        return this.agentRepository.disableAgent(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetFreeTenantsUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(): Observable<TenantLibreDto[]> {
        return this.agentRepository.getFreeTenants();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AssignTenantsUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(payload: AssignRequestDto): Observable<void> {
        return this.agentRepository.assignTenants(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class ReassignTenantsUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(payload: ReassignRequestDto): Observable<void> {
        return this.agentRepository.reassignTenants(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class RemoveTenantsUseCase {
    private readonly agentRepository = inject(AgentRepository);

    execute(payload: RemoveRequestDto): Observable<void> {
        return this.agentRepository.removeTenants(payload);
    }
}
