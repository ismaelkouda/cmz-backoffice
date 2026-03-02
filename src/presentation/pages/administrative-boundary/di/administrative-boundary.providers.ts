import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/domain/services/env.service';

import { provideDepartmentsFindOne } from '@presentation/pages/administrative-boundary/di/departments/departments-find-one.providers';
import { departmentsSelectProviders } from '@presentation/pages/administrative-boundary/di/departments/departments-select.providers';
import { provideDepartments } from '@presentation/pages/administrative-boundary/di/departments/departments.providers';
import { municipalitiesByDepartmentIdProviders } from '@presentation/pages/administrative-boundary/di/departments/municipalities-by-department-id.providers';
import { provideMunicipalitiesFindOne } from '@presentation/pages/administrative-boundary/di/municipalities/municipalities-find-one.providers';
import { municipalitiesSelectProviders } from '@presentation/pages/administrative-boundary/di/municipalities/municipalities-select.providers';
import { provideMunicipalities } from '@presentation/pages/administrative-boundary/di/municipalities/municipalities.providers';
import { departmentsByRegionIdProviders } from '@presentation/pages/administrative-boundary/di/regions/departments-by-region-id.providers';
import { provideRegionsFindOne } from '@presentation/pages/administrative-boundary/di/regions/regions-find-one.providers';
import { regionsSelectProviders } from '@presentation/pages/administrative-boundary/di/regions/regions-select.providers';
import { provideRegions } from '@presentation/pages/administrative-boundary/di/regions/regions.providers';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';

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
    ...provideDepartmentsFindOne,
    ...departmentsSelectProviders,
    ...provideDepartments,
    ...municipalitiesByDepartmentIdProviders,

    ...provideMunicipalitiesFindOne,
    ...municipalitiesSelectProviders,
    ...provideMunicipalities,

    ...departmentsByRegionIdProviders,
    ...provideRegionsFindOne,
    ...regionsSelectProviders,
    ...provideRegions,
];
