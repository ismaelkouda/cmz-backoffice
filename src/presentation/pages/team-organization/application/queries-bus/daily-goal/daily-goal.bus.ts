import { Injectable } from '@angular/core';
import { DailyGoalQuery } from '@pages/team-organization/application/queries/daily-goal/daily-goal.query';
import { DailyGoalHandler } from '@pages/team-organization/application/queries-handlers/daily-goal/daily-goal.handler';
import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DailyGoalBus {
    constructor(private readonly filterHandler: DailyGoalHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<DailyGoalEntity>> {
        if (query instanceof DailyGoalQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
