import { Provider } from '@angular/core';

import { RolesSelectUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/roles-select.use-case';
import { RolesSelectRepository } from '@presentation/pages/team-organization/domain/repositories/participants/roles-select-repository';
import { RolesSelectMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/roles-select.mapper';
import { RolesSelectRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/participants/roles-select-repository.impl';
import { RolesSelectApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/roles-select.api';

export const rolesSelectProviders: Provider[] = [
    RolesSelectApi,
    RolesSelectMapper,
    RolesSelectUseCase,
    {
        provide: RolesSelectRepository,
        useClass: RolesSelectRepositoryImpl,
    },
];
