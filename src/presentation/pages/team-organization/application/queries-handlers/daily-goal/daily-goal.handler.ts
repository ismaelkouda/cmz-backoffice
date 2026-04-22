import { Injectable } from '@angular/core';
import { DailyGoalQuery } from '@pages/team-organization/application/queries/daily-goal/daily-goal.query';
import { DailyGoalUseCase } from '@pages/team-organization/application/use-cases/daily-goal/daily-goal.use-case';
import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DailyGoalHandler {
    constructor(private readonly useCase: DailyGoalUseCase) {}

    execute(
        query: DailyGoalQuery,
        page: string
    ): Observable<Paginate<DailyGoalEntity>> {
        return this.useCase.execute(
            {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
