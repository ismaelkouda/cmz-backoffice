import { MUNICIPALITIES_ROUTE } from "@presentation/pages/administrative-boundary/administrative-boundary.route";
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from "@shared/routes/routes";

export const MUNICIPALITIES_TABS = [
    {
        value: '0',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${MUNICIPALITIES_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABS.MUNICIPALITIES.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/history`,
        label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
    },
];