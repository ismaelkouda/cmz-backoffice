import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { AgentsPerformancesFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-filter.entity';
import { AgentsPerformancesEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { AgentsPerformancesRepository } from '@presentation/pages/team-organization/domain/repositories/agents-performances/agents-performances.repository';
import { AgentsPerformancesFilterMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/agents-performances/agents-performances-filter.mapper';
import { AgentsPerformancesMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/agents-performances/agents-performances.mapper';
import { AgentsPerformancesApi } from '@presentation/pages/team-organization/infrastructure/data/sources/agents-participants/agents-performances.api';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesRepositoryImpl
    implements AgentsPerformancesRepository
{
    private readonly api = inject(AgentsPerformancesApi);
    private readonly mapper = inject(AgentsPerformancesMapper);

    readAll(
        filter: AgentsPerformancesFilterEntity,
        page: string
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        const paramsDto = AgentsPerformancesFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
