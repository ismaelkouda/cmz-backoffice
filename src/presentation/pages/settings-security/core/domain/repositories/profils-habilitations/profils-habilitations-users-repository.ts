import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsUsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-filter.entity';
import { ProfilsHabilitationsUsersReassignEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-reassign.entity';
import { ProfilsHabilitationsUsersRemoveEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-remove.entity';
import { ProfilsHabilitationsUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users.entity';

export abstract class ProfilsHabilitationsUsersRepository {
    abstract readAll(
        filter: ProfilsHabilitationsUsersFilterEntity | null,
        page: string
    ): Observable<Paginate<ProfilsHabilitationsUsersEntity>>;

    abstract reassign(
        dto: ProfilsHabilitationsUsersReassignEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract remove(
        dto: ProfilsHabilitationsUsersRemoveEntity
    ): Observable<SimpleResponseDto<void>>;
}
