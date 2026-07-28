import { Routes } from '@angular/router';
import {
    RADIO_RELAY_LINKS_FORM,
    RADIO_RELAY_LINKS_LIST,
    RADIO_RELAY_LINKS_HISTORY,
} from '@pages/coverage-areas/presentation/features/radio-relay-links/radio-relay-links-paths.constants';

export const RADIO_RELAY_LINKS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/coverage-areas/presentation/features/radio-relay-links/radio-relay-links-page/radio-relay-links-page.component').then(
                (m) => m.RadioRelayLinksPageComponent
            ),
        data: {
            title: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TITLE',
            breadcrumb: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: RADIO_RELAY_LINKS_LIST,
            },
            {
                path: RADIO_RELAY_LINKS_LIST,
                loadComponent: () =>
                    import('@pages/coverage-areas/presentation/features/radio-relay-links/radio-relay-links-list/radio-relay-links-list.component').then(
                        (m) => m.RadioRelayLinksListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: RADIO_RELAY_LINKS_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: RADIO_RELAY_LINKS_FORM,
        loadComponent: () =>
            import('@pages/coverage-areas/presentation/features/radio-relay-links/radio-relay-links-form/radio-relay-links-form.component').then(
                (m) => m.RadioRelayLinksFormComponent
            ),
        data: {
            title: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.TITLE',
            breadcrumb: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.TITLE',
        },
    },
];
