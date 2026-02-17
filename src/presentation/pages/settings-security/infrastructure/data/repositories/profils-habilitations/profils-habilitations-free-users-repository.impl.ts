import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsFreeUsersAssignEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-free-users-assign.entity';
import { ProfilsHabilitationsFreeUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-free-users.entity';
import { ProfilsHabilitationsFreeUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-free-users-repository';
import { profilsHabilitationsFreeUsersAssignMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-free-users-assign.mapper';
import { ProfilsHabilitationsFreeUsersMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-free-users.mapper';
import { ProfilsHabilitationsFreeUsersApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profils-habilitations/profils-habilitations-free-users.api';

@Injectable({ providedIn: 'root' })
export class ProfilsHabilitationsFreeUsersRepositoryImpl implements ProfilsHabilitationsFreeUsersRepository {
    private readonly api = inject(ProfilsHabilitationsFreeUsersApi);
    private readonly mapper = inject(ProfilsHabilitationsFreeUsersMapper);

    readAll(
        page: string
    ): Observable<Paginate<ProfilsHabilitationsFreeUsersEntity>> {
        return this.api
            .readAll(page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    assign(
        dto: ProfilsHabilitationsFreeUsersAssignEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = profilsHabilitationsFreeUsersAssignMapper(dto);
        return this.api.assign(dtoApi);
    }
}
