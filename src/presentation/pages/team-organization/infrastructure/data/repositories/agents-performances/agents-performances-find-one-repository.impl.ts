import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AgentsPerformancesFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one-filter.entity';
import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';
import { AgentsPerformancesFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/agents-performances/agents-performances-find-one.repository';
import { agentsPerformancesFindOneFilterMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/agents-performances/agents-performances-find-one-filter.mapper';
import { AgentsPerformancesFindOneMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/agents-performances/agents-performances-find-one.mapper';
import { AgentsPerformancesFindOneApi } from '@presentation/pages/team-organization/infrastructure/data/sources/agents-performances/agents-performances-find-one.api';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFindOneRepositoryImpl implements AgentsPerformancesFindOneRepository {
    private readonly api = inject(AgentsPerformancesFindOneApi);
    private readonly mapper = inject(AgentsPerformancesFindOneMapper);

    execute(
        filter: AgentsPerformancesFindOneFilterEntity,
        page: string
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>> {
        const paramsDto = agentsPerformancesFindOneFilterMapper(filter);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
