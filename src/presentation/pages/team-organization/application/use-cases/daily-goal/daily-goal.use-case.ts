import { inject, Injectable } from '@angular/core';
import { DailyGoalFilterDto } from '@pages/team-organization/application/dto/daily-goal/daily-goal-filter.dto';
import { DailyGoalFilterEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal-filter.entity';
import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { DailyGoalRepository } from '@pages/team-organization/domain/repositories/daily-goal/daily-goal.repository';
import { DailyGoalFilterVo } from '@pages/team-organization/domain/value-objects/daily-goal/daily-goal-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DailyGoalUseCase {
    private readonly repository = inject(DailyGoalRepository);

    execute(
        filterDto: DailyGoalFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DailyGoalEntity>> {
        const vo = DailyGoalFilterVo.fromDto(filterDto);
        const entity = DailyGoalFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }
}
