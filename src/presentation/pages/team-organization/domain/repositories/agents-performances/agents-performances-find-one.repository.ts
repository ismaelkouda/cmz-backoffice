import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { AgentsPerformancesFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one-filter.entity';
import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';

export abstract class AgentsPerformancesFindOneRepository {
    abstract execute(
        filter: AgentsPerformancesFindOneFilterEntity | null,
        page: string
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>>;
}
