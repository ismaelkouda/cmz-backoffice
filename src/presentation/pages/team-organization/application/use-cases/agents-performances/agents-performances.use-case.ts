import { inject, Injectable } from '@angular/core';
import { AgentsPerformancesFilterDto } from '@pages/team-organization/application/dto/agents-performances/agents-performances-filter.dto';
import { AgentsPerformancesFilterEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-filter.entity';
import { AgentsPerformancesEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { AgentsPerformancesRepository } from '@pages/team-organization/domain/repositories/agents-performances/agents-performances.repository';
import { AgentsPerformancesFilterVo } from '@pages/team-organization/domain/value-objects/agents-performances/agents-performances-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesUseCase {
    private readonly repository = inject(AgentsPerformancesRepository);

    execute(
        filterDto: AgentsPerformancesFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        const vo = AgentsPerformancesFilterVo.fromDto(filterDto);
        const entity = AgentsPerformancesFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }
}
