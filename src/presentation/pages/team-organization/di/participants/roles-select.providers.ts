import { Provider } from '@angular/core';
import { RolesSelectRepository } from '@pages/team-organization/domain/repositories/participants/roles-select-repository';
import { RolesSelectRepositoryImpl } from '@pages/team-organization/infrastructure/data/repositories/participants/roles-select-repository.impl';

export const rolesSelectProviders: Provider[] = [
    {
        provide: RolesSelectRepository,
        useClass: RolesSelectRepositoryImpl,
    },
];
