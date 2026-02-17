import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AgentsPerformancesFilterDto } from '@presentation/pages/team-organization/application/dto/agents-performances/agents-performances-filter.dto';
import { AgentsPerformancesFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-filter.entity';
import { AgentsPerformancesEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { AgentsPerformancesRepository } from '@presentation/pages/team-organization/domain/repositories/agents-performances/agents-performances.repository';
import { AgentsPerformancesFilterVo } from '@presentation/pages/team-organization/domain/value-objects/agents-performances/agents-performances-filter.vo';

export class AgentsPerformancesUseCase {
    private readonly repository = inject(AgentsPerformancesRepository);

    execute(
        filterDto: AgentsPerformancesFilterDto | null,
        page: string
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        const vo = AgentsPerformancesFilterVo.fromDto(filterDto);
        const entity = AgentsPerformancesFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }
}
