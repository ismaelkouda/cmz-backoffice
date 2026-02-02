import { Provider } from '@angular/core';

import { ProfilsHabilitationsUsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profils-habilitations/profils-habilitations-users.use-case';
import { ProfilsHabilitationsUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-users-repository';
import { ProfilsHabilitationsUsersMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-users.mapper';
import { ProfilsHabilitationsUsersRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profils-habilitations/profils-habilitations-users-repository.impl';
import { ProfilsHabilitationsUsersApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profils-habilitations/profils-habilitations-users.api';

export const profilsHabilitationsUsersProviders: Provider[] = [
    ProfilsHabilitationsUsersApi,
    ProfilsHabilitationsUsersMapper,
    ProfilsHabilitationsUsersUseCase,
    {
        provide: ProfilsHabilitationsUsersRepository,
        useClass: ProfilsHabilitationsUsersRepositoryImpl,
    },
];
