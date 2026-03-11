import { AgentsPerformancesFilterEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-filter.entity';
import { AgentsPerformancesEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class AgentsPerformancesRepository {
    abstract readAll(
        filter: AgentsPerformancesFilterEntity | null,
        page: string
    ): Observable<Paginate<AgentsPerformancesEntity>>;
}
