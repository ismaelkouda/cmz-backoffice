import { Routes } from '@angular/router';
import { DailyGoalListComponent } from '@pages/team-organization/presentation/features/daily-goal/daily-goal-list/daily-goal-list.component';
import { DailyGoalPageComponent } from '@pages/team-organization/presentation/features/daily-goal/daily-goal-page/daily-goal-page.component';
import {
    DAILY_GOAL_HISTORY,
    DAILY_GOAL_LIST,
} from '@pages/team-organization/presentation/features/daily-goal/daily-goal-paths.constants';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const DAILY_GOAL_ROUTES: Routes = [
    {
        path: '',
        component: DailyGoalPageComponent,
        data: {
            icon: 'TEAM_ORGANIZATION.DAILY_GOAL.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.DAILY_GOAL.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: DAILY_GOAL_LIST,
            },
            {
                path: DAILY_GOAL_LIST,
                component: DailyGoalListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: DAILY_GOAL_HISTORY,
                component: HistoryPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
