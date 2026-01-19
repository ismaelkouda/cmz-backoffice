import { inject, Provider } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '../infrastructure/api/administrative-boundary.config';
import { provideDepartmentsFindone } from './departments/departments-findone.providers';
import { departmentsSelectProviders } from './departments/departments-select.providers';
import { provideDepartments } from './departments/departments.providers';
import { municipalitiesByDepartmentIdProviders } from './departments/municipalities-by-department-id.providers';
import { provideMunicipalitiesFindone } from './municipalities/municipalities-findone.providers';
import { provideMunicipalities } from './municipalities/municipalities.providers';
import { departmentsByRegionIdProviders } from './regions/departments-by-region-id.providers';
import { provideRegionsFindone } from './regions/regions-findone.providers';
import { regionsSelectProviders } from './regions/regions-select.providers';
import { provideRegions } from './regions/regions.providers';
const getApiBaseUrl = (): string => {
    const baseUrl = inject(EnvService).settingUrl;

    if (!baseUrl) {
        console.warn(
            'AdministrativeBoundary Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideAdministrativeBoundary = (): Provider[] => [
    {
        provide: ADMINISTRATIVE_BOUNDARY_API_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...provideDepartments,
    ...provideMunicipalities,
    ...provideRegions,
    ...departmentsSelectProviders,
    ...departmentsByRegionIdProviders,
    ...municipalitiesByDepartmentIdProviders,
    ...regionsSelectProviders,
    ...provideDepartmentsFindone,
    ...provideRegionsFindone,
    ...provideMunicipalitiesFindone,
];
