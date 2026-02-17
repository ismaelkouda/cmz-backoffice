import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AgentsPerformancesFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one-filter.entity';
import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';

export abstract class AgentsPerformancesFindOneRepository {
    abstract execute(
        filter: AgentsPerformancesFindOneFilterEntity,
        page: string
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>>;
}
