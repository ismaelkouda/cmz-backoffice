import { dailyGoalQueryMapper } from '@pages/team-organization/application/queries-mappers/daily-goal/daily-goal.mapper';
import { Injectable, inject } from '@angular/core';
import { DailyGoalQuery } from '@pages/team-organization/application/queries/daily-goal/daily-goal.query';
import { DailyGoalUseCase } from '@pages/team-organization/application/use-cases/daily-goal/daily-goal.use-case';
import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DailyGoalHandler {
    private readonly useCase = inject(DailyGoalUseCase);

    execute(
        query: DailyGoalQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DailyGoalEntity>> {
        return this.useCase.execute(dailyGoalQueryMapper(query), page, options);
    }
}
