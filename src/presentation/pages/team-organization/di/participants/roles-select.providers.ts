import { Provider } from '@angular/core';

import { RolesSelectRepository } from '@presentation/pages/team-organization/domain/repositories/participants/roles-select-repository';
import { RolesSelectRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/participants/roles-select-repository.impl';

export const rolesSelectProviders: Provider[] = [
    {
        provide: RolesSelectRepository,
        useClass: RolesSelectRepositoryImpl,
    },
];
