import { Provider } from '@angular/core';

import { ProfilsHabilitationsUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profils-habilitations/profils-habilitations.use-case';
import { ProfilsHabilitationsRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-repository';
import { ProfilsHabilitationsMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations.mapper';
import { ProfilsHabilitationsRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profils-habilitations/profils-habilitations-repository.impl';
import { ProfilsHabilitationsApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profils-habilitations/profils-habilitations.api';

export const profilsHabilitationsProviders: Provider[] = [
    ProfilsHabilitationsApi,
    ProfilsHabilitationsMapper,
    ProfilsHabilitationsUseCase,
    {
        provide: ProfilsHabilitationsRepository,
        useClass: ProfilsHabilitationsRepositoryImpl,
    },
];
