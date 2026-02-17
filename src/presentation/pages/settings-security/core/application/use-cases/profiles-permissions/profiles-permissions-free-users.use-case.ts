import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsFreeUsersAssignDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-free-users-assign.dto';
import { ProfilesPermissionsFreeUsersAssignEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-free-users-assign.entity';
import { ProfilesPermissionsFreeUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-free-users.entity';
import { ProfilesPermissionsFreeUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-free-users-repository';
import { ProfilesPermissionsFreeUsersAssignVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-free-users-assign.vo';

export class ProfilesPermissionsFreeUsersUseCase {
    private readonly repository = inject(
        ProfilesPermissionsFreeUsersRepository
    );

    execute(
        filter: null,
        page: string
    ): Observable<Paginate<ProfilesPermissionsFreeUsersEntity>> {
        return this.repository.execute(page);
    }

    assign(
        dto: ProfilesPermissionsFreeUsersAssignDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsFreeUsersAssignVo.fromDto(dto);
        const entity = ProfilesPermissionsFreeUsersAssignEntity.toEntity(vo);
        return this.repository.assign(entity);
    }
}
