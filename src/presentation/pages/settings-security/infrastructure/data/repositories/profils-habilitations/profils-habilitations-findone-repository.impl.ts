import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ProfilsHabilitationsFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone-filter.entity';
import { ProfilsHabilitationsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone.entity';
import { ProfilsHabilitationsFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-findone-repository';
import { profilsHabilitationsFindOneFilterMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-findone-filter.mapper';
import { ProfilsHabilitationsFindOneMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-findone.mapper';
import { ProfilsHabilitationsFindOneApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profils-habilitations/profils-habilitations-findone.api';

@Injectable({ providedIn: 'root' })
export class ProfilsHabilitationsFindOneRepositoryImpl
    implements ProfilsHabilitationsFindOneRepository
{
    private readonly api = inject(ProfilsHabilitationsFindOneApi);
    private readonly mapper = inject(ProfilsHabilitationsFindOneMapper);

    read(
        filter?: ProfilsHabilitationsFindOneFilterEntity
    ): Observable<ProfilsHabilitationsFindOneEntity> {
        const paramsDto = profilsHabilitationsFindOneFilterMapper(filter);
        return this.api
            .readAll(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
