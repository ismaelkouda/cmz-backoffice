import { Injectable, inject } from '@angular/core';
import { AgentsPerformancesFindOneFilterDto } from '@pages/team-organization/application/dto/agents-performances/agents-performances-find-one-filter.dto';
import { AgentsPerformancesFindOneFilterEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-find-one-filter.entity';
import { AgentsPerformancesFindOneEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';
import { AgentsPerformancesFindOneRepository } from '@pages/team-organization/domain/repositories/agents-performances/agents-performances-find-one.repository';
import { AgentsPerformancesFindOneFilterVo } from '@pages/team-organization/domain/value-objects/agents-performances/agents-performance-find-one-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AgentsPerformancesFindOneUseCase {
    private readonly repository = inject(AgentsPerformancesFindOneRepository);

    execute(
        filterDto: AgentsPerformancesFindOneFilterDto,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>> {
        const vo = AgentsPerformancesFindOneFilterVo.fromDto(filterDto);
        const filter = AgentsPerformancesFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, page, options);
    }
}
