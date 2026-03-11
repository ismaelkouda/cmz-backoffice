import { AgentsPerformancesFindOneFilterEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-find-one-filter.entity';
import { AgentsPerformancesFindOneEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class AgentsPerformancesFindOneRepository {
    abstract execute(
        filter: AgentsPerformancesFindOneFilterEntity,
        page: string
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>>;
}
