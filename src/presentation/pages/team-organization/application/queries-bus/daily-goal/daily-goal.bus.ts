import { Injectable, inject } from '@angular/core';
import { DailyGoalQuery } from '@pages/team-organization/application/queries/daily-goal/daily-goal.query';
import { DailyGoalHandler } from '@pages/team-organization/application/queries-handlers/daily-goal/daily-goal.handler';
import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class DailyGoalBus {
    private readonly filterHandler = inject(DailyGoalHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DailyGoalEntity>> {
        if (query instanceof DailyGoalQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
