import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsFreeUsersAssignEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-free-users-assign.entity';
import { ProfilsHabilitationsFreeUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-free-users.entity';

export abstract class ProfilsHabilitationsFreeUsersRepository {
    abstract readAll(
        page: string
    ): Observable<Paginate<ProfilsHabilitationsFreeUsersEntity>>;

    abstract assign(
        dto: ProfilsHabilitationsFreeUsersAssignEntity
    ): Observable<SimpleResponseDto<void>>;
}
