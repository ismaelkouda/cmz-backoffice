import { Provider } from '@angular/core';
import { provideDepartmentsFindOne } from '@pages/administrative-boundary/di/departments/departments-find-one.providers';
import { departmentsSelectProviders } from '@pages/administrative-boundary/di/departments/departments-select.providers';
import { provideDepartments } from '@pages/administrative-boundary/di/departments/departments.providers';
import { municipalitiesByDepartmentIdProviders } from '@pages/administrative-boundary/di/departments/municipalities-by-department-id.providers';
import { provideMunicipalitiesFindOne } from '@pages/administrative-boundary/di/municipalities/municipalities-find-one.providers';
import { municipalitiesSelectProviders } from '@pages/administrative-boundary/di/municipalities/municipalities-select.providers';
import { provideMunicipalities } from '@pages/administrative-boundary/di/municipalities/municipalities.providers';
import { departmentsByRegionIdProviders } from '@pages/administrative-boundary/di/regions/departments-by-region-id.providers';
import { provideRegionsFindOne } from '@pages/administrative-boundary/di/regions/regions-find-one.providers';
import { regionsSelectProviders } from '@pages/administrative-boundary/di/regions/regions-select.providers';
import { provideRegions } from '@pages/administrative-boundary/di/regions/regions.providers';

export const provideAdministrativeBoundary = (): Provider[] => [
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
