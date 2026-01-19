import { REGIONS_ROUTE } from "@presentation/pages/administrative-boundary/administrative-boundary.route";
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from "@shared/routes/routes";

export const REGIONS_TABS = [
    {
        value: '0',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${REGIONS_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABS.REGIONS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/history`,
        label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
    },
];