import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsUsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-filter.entity';
import { ProfilsHabilitationsUsersReassignEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-reassign.entity';
import { ProfilsHabilitationsUsersRemoveEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-remove.entity';
import { ProfilsHabilitationsUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users.entity';
import { ProfilsHabilitationsUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-users-repository';
import { profilsHabilitationsUsersFilterMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-users-filter.mapper';
import { profilsHabilitationsUsersReassignMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-users-reassign.mapper';
import { profilsHabilitationsUsersRemoveMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-users-remove.mapper';
import { ProfilsHabilitationsUsersMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-users.mapper';
import { ProfilsHabilitationsUsersApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profils-habilitations/profils-habilitations-users.api';

@Injectable({ providedIn: 'root' })
export class ProfilsHabilitationsUsersRepositoryImpl
    implements ProfilsHabilitationsUsersRepository
{
    private readonly api = inject(ProfilsHabilitationsUsersApi);
    private readonly mapper = inject(ProfilsHabilitationsUsersMapper);

    readAll(
        filter: ProfilsHabilitationsUsersFilterEntity,
        page: string
    ): Observable<Paginate<ProfilsHabilitationsUsersEntity>> {
        const paramsDto = profilsHabilitationsUsersFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    reassign(
        dto: ProfilsHabilitationsUsersReassignEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = profilsHabilitationsUsersReassignMapper(dto);
        return this.api.reassign(dtoApi);
    }

    remove(
        dto: ProfilsHabilitationsUsersRemoveEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = profilsHabilitationsUsersRemoveMapper(dto);
        return this.api.remove(dtoApi);
    }
}
