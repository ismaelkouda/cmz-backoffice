import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsUsersFilterDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-filter.dto';
import { ProfilsHabilitationsUsersReassignDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-reassign.dto';
import { ProfilsHabilitationsUsersRemoveDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-remove.dto';
import { ProfilsHabilitationsUsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-filter.entity';
import { ProfilsHabilitationsUsersReassignEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-reassign.entity';
import { ProfilsHabilitationsUsersRemoveEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users-remove.entity';
import { ProfilsHabilitationsUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users.entity';
import { ProfilsHabilitationsUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-users-repository';
import { ProfilsHabilitationsUsersFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-users-filter.vo';
import { ProfilsHabilitationsUsersReassignVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-users-reassign.vo';
import { ProfilsHabilitationsUsersRemoveVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-users-remove.vo';

export class ProfilsHabilitationsUsersUseCase {
    private readonly repository = inject(ProfilsHabilitationsUsersRepository);

    readAll(
        filterDto: ProfilsHabilitationsUsersFilterDto | null,
        page: string
    ): Observable<Paginate<ProfilsHabilitationsUsersEntity>> {
        const vo = ProfilsHabilitationsUsersFilterVo.fromDto(filterDto);
        const entity = ProfilsHabilitationsUsersFilterEntity.toEntity(vo);
        return this.repository.readAll(entity, page);
    }

    reassign(
        dto: ProfilsHabilitationsUsersReassignDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilsHabilitationsUsersReassignVo.fromDto(dto);
        const entity = ProfilsHabilitationsUsersReassignEntity.toEntity(vo);
        return this.repository.reassign(entity);
    }

    remove(
        dto: ProfilsHabilitationsUsersRemoveDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilsHabilitationsUsersRemoveVo.fromDto(dto);
        const entity = ProfilsHabilitationsUsersRemoveEntity.toEntity(vo);
        return this.repository.remove(entity);
    }
}
