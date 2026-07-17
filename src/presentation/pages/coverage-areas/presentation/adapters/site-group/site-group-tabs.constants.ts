import {
    SITE_GROUP_LIST,
    SITE_GROUP_HISTORY,
    SITE_GROUP_ROUTE,
} from '@pages/coverage-areas/presentation/features/site-group/site-group-paths.constants';
import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';

export const SITE_GROUP_TABS = [
    {
        value: '0',
        route: `/${COVERAGE_AREAS_ROUTE}/${SITE_GROUP_ROUTE}/${SITE_GROUP_LIST}`,
        label: 'COVERAGE_AREAS.SITE_GROUP.TABS.SITE_GROUP.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${COVERAGE_AREAS_ROUTE}/${SITE_GROUP_ROUTE}/${SITE_GROUP_HISTORY}`,
        label: 'COVERAGE_AREAS.SITE_GROUP.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: {
            ref: 'site-groups',
        },
    },
];
