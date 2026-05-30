import { Routes } from '@angular/router';

import {
    DAILY_GOAL_HISTORY,
    DAILY_GOAL_LIST,
} from '@pages/team-organization/presentation/features/daily-goal/daily-goal-paths.constants';

export const DAILY_GOAL_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/team-organization/presentation/features/daily-goal/daily-goal-page/daily-goal-page.component').then(
                (m) => m.DailyGoalPageComponent
            ),
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
                loadComponent: () =>
                    import('@pages/team-organization/presentation/features/daily-goal/daily-goal-list/daily-goal-list.component').then(
                        (m) => m.DailyGoalListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: DAILY_GOAL_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
