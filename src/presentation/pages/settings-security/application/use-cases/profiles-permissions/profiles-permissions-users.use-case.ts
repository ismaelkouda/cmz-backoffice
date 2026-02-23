import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersAssignDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-assign.dto';
import { ProfilesPermissionsUsersFilterDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-filter.dto';
import { ProfilesPermissionsUsersReassignDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-reassign.dto';
import { ProfilesPermissionsUsersRemoveDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-remove.dto';
import { ProfilesPermissionsUsersAssignEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-assign.entity';
import { ProfilesPermissionsUsersFilterEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-filter.entity';
import { ProfilesPermissionsUsersReassignEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-reassign.entity';
import { ProfilesPermissionsUsersRemoveEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-remove.entity';
import { ProfilesPermissionsUsersEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';
import { ProfilesPermissionsUsersRepository } from '@presentation/pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-users-repository';
import { ProfilesPermissionsUsersAssignVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-users-assign.vo';
import { ProfilesPermissionsUsersFilterVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-users-filter.vo';
import { ProfilesPermissionsUsersReassignVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-users-reassign.vo';
import { ProfilesPermissionsUsersRemoveVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-users-remove.vo';

export class ProfilesPermissionsUsersUseCase {
    private readonly repository = inject(ProfilesPermissionsUsersRepository);

    execute(
        filterDto: ProfilesPermissionsUsersFilterDto | null,
        page: string
    ): Observable<Paginate<ProfilesPermissionsUsersEntity>> {
        const vo = ProfilesPermissionsUsersFilterVo.fromDto(filterDto);
        const entity = ProfilesPermissionsUsersFilterEntity.toEntity(vo);
        return this.repository.execute(entity, page);
    }

    reassign(
        dto: ProfilesPermissionsUsersReassignDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsUsersReassignVo.fromDto(dto);
        const entity = ProfilesPermissionsUsersReassignEntity.toEntity(vo);
        return this.repository.reassign(entity);
    }

    assign(
        command: ProfilesPermissionsUsersAssignDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsUsersAssignVo.create(command);
        const entity = ProfilesPermissionsUsersAssignEntity.fromVo(vo);
        return this.repository.assign(entity);
    }

    remove(
        dto: ProfilesPermissionsUsersRemoveDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsUsersRemoveVo.fromDto(dto);
        const entity = ProfilesPermissionsUsersRemoveEntity.toEntity(vo);
        return this.repository.remove(entity);
    }
}
