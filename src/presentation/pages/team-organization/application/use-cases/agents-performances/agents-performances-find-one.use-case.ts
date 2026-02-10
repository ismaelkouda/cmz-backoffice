import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { AgentsPerformancesFindOneFilterDto } from '@presentation/pages/team-organization/application/dtos/agents-performances/agents-performances-findone-filter.dto';
import { AgentsPerformancesFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one-filter.entity';
import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';
import { AgentsPerformancesFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/agents-performances/agents-performances-find-one.repository';
import { AgentsPerformancesFindOneFilterVo } from '@presentation/pages/team-organization/domain/value-objects/agents-performances/agents-performance-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class AgentsPerformancesFindOneUseCase {
    private readonly repository = inject(AgentsPerformancesFindOneRepository);

    execute(
        filterDto: AgentsPerformancesFindOneFilterDto | null,
        page: string
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>> {
        const vo = AgentsPerformancesFindOneFilterVo.fromDto(filterDto);
        const filter = AgentsPerformancesFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, page);
    }
}
