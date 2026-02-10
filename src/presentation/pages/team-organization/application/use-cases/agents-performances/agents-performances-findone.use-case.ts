import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AgentsPerformancesFindOneFilterDto } from '@presentation/pages/team-organization/application/dtos/agents-performances/agents-performances-findone-filter.dto';
import { AgentsPerformancesFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-findOne-filter.entity';
import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-findOne.entity';
import { AgentsPerformancesFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/agents-performances/agents-performances-findone-repository';
import { AgentsPerformancesFindOneFilterVo } from '@presentation/pages/team-organization/domain/value-objects/agents-performances/agents-performances-findone-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class AgentsPerformancesFindOneUseCase {
    private readonly repository = inject(AgentsPerformancesFindOneRepository);

    read(
        filterDto: AgentsPerformancesFindOneFilterDto
    ): Observable<AgentsPerformancesFindOneEntity> {
        const vo = AgentsPerformancesFindOneFilterVo.fromDto(filterDto);
        const filter = AgentsPerformancesFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
