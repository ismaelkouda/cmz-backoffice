import { DailyGoalFilterEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal-filter.entity';
import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class DailyGoalRepository {
    abstract readAll(
        filter: DailyGoalFilterEntity | null,
        page: string
    ): Observable<Paginate<DailyGoalEntity>>;
}
