import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AgentsPerformancesFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-filter.entity';
import { AgentsPerformancesEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';

export abstract class AgentsPerformancesRepository {
    abstract readAll(
        filter: AgentsPerformancesFilterEntity | null,
        page: string
    ): Observable<Paginate<AgentsPerformancesEntity>>;
}
