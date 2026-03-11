import { inject, Injectable } from '@angular/core';
import { AgentsPerformancesFilterEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-filter.entity';
import { AgentsPerformancesEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { AgentsPerformancesRepository } from '@pages/team-organization/domain/repositories/agents-performances/agents-performances.repository';
import { AgentsPerformancesFilterMapper } from '@pages/team-organization/infrastructure/data/mappers/agents-performances/agents-performances-filter.mapper';
import { AgentsPerformancesMapper } from '@pages/team-organization/infrastructure/data/mappers/agents-performances/agents-performances.mapper';
import { AgentsPerformancesApi } from '@pages/team-organization/infrastructure/data/sources/agents-performances/agents-performances.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesRepositoryImpl implements AgentsPerformancesRepository {
    private readonly api = inject(AgentsPerformancesApi);
    private readonly mapper = inject(AgentsPerformancesMapper);

    readAll(
        filter: AgentsPerformancesFilterEntity,
        page: string
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        const paramsDto = AgentsPerformancesFilterMapper(filter);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
