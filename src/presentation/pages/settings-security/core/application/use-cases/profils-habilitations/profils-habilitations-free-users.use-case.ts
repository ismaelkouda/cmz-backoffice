import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsFreeUsersAssignDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-free-users-assign.dto';
import { ProfilsHabilitationsFreeUsersAssignEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-free-users-assign.entity';
import { ProfilsHabilitationsFreeUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-free-users.entity';
import { ProfilsHabilitationsFreeUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-free-users-repository';
import { ProfilsHabilitationsFreeUsersAssignVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-free-users-assign.vo';

export class ProfilsHabilitationsFreeUsersUseCase {
    private readonly repository = inject(
        ProfilsHabilitationsFreeUsersRepository
    );

    readAll(
        filter: null,
        page: string
    ): Observable<Paginate<ProfilsHabilitationsFreeUsersEntity>> {
        return this.repository.readAll(page);
    }

    assign(
        dto: ProfilsHabilitationsFreeUsersAssignDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilsHabilitationsFreeUsersAssignVo.fromDto(dto);
        const entity = ProfilsHabilitationsFreeUsersAssignEntity.toEntity(vo);
        return this.repository.assign(entity);
    }
}
