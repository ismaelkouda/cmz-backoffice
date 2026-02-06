import { Provider } from '@angular/core';

import { ProfilsHabilitationsFreeUsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profils-habilitations/profils-habilitations-free-users.use-case';
import { ProfilsHabilitationsFreeUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-free-users-repository';
import { ProfilsHabilitationsFreeUsersMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-free-users.mapper';
import { ProfilsHabilitationsFreeUsersRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profils-habilitations/profils-habilitations-free-users-repository.impl';
import { ProfilsHabilitationsFreeUsersApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profils-habilitations/profils-habilitations-free-users.api';

export const profilsHabilitationsFreeUsersProviders: Provider[] = [
    ProfilsHabilitationsFreeUsersApi,
    ProfilsHabilitationsFreeUsersMapper,
    ProfilsHabilitationsFreeUsersUseCase,
    {
        provide: ProfilsHabilitationsFreeUsersRepository,
        useClass: ProfilsHabilitationsFreeUsersRepositoryImpl,
    },
];
