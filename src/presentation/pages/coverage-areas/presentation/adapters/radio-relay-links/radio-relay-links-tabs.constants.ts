import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';
import {
    RADIO_RELAY_LINKS_HISTORY,
    RADIO_RELAY_LINKS_LIST,
    RADIO_RELAY_LINKS_ROUTE,
} from '../../features/radio-relay-links/radio-relay-links-paths.constants';

export const RADIO_RELAY_LINKS_TABS = [
    {
        value: '0',
        route: `/${COVERAGE_AREAS_ROUTE}/${RADIO_RELAY_LINKS_ROUTE}/${RADIO_RELAY_LINKS_LIST}`,
        label: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TABS.RADIO_RELAY_LINKS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${COVERAGE_AREAS_ROUTE}/${RADIO_RELAY_LINKS_ROUTE}/${RADIO_RELAY_LINKS_HISTORY}`,
        label: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: {
            ref: 'coverage-areas',
        },
    },
];
