import { inject, Injectable } from '@angular/core';
import { DailyGoalFilterEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal-filter.entity';
import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { DailyGoalRepository } from '@pages/team-organization/domain/repositories/daily-goal/daily-goal.repository';
import { DailyGoalFilterMapper } from '@pages/team-organization/infrastructure/data/mappers/daily-goal/daily-goal-filter.mapper';
import { DailyGoalMapper } from '@pages/team-organization/infrastructure/data/mappers/daily-goal/daily-goal.mapper';
import { DailyGoalApi } from '@pages/team-organization/infrastructure/data/sources/daily-goal/daily-goal.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DailyGoalRepositoryImpl implements DailyGoalRepository {
    private readonly api = inject(DailyGoalApi);
    private readonly mapper = inject(DailyGoalMapper);

    readAll(
        filter: DailyGoalFilterEntity,
        page: string
    ): Observable<Paginate<DailyGoalEntity>> {
        const paramsDto = DailyGoalFilterMapper(filter);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
