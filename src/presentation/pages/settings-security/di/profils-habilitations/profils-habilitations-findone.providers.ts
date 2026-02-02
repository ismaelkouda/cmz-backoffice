import { Provider } from '@angular/core';

import { ProfilsHabilitationsFindOneUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profils-habilitations/profils-habilitations-findone.use-case';
import { ProfilsHabilitationsFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-findone-repository';
import { ProfilsHabilitationsFindOneMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-findone.mapper';
import { ProfilsHabilitationsFindOneRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profils-habilitations/profils-habilitations-findone-repository.impl';
import { ProfilsHabilitationsFindOneApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profils-habilitations/profils-habilitations-findone.api';

export const profilsHabilitationsFindOneProviders: Provider[] = [
    ProfilsHabilitationsFindOneApi,
    ProfilsHabilitationsFindOneMapper,
    ProfilsHabilitationsFindOneUseCase,
    {
        provide: ProfilsHabilitationsFindOneRepository,
        useClass: ProfilsHabilitationsFindOneRepositoryImpl,
    },
];
