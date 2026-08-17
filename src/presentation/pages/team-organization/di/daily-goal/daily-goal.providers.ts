import { Provider } from '@angular/core';
import { DailyGoalRepository } from '@pages/team-organization/domain/repositories/daily-goal/daily-goal.repository';
import { DailyGoalRepositoryImpl } from '@pages/team-organization/infrastructure/data/repositories/daily-goal/daily-goal-repository.impl';

export const agentsPerformancesProviders: Provider[] = [
    {
        provide: DailyGoalRepository,
        useClass: DailyGoalRepositoryImpl,
    },
];
