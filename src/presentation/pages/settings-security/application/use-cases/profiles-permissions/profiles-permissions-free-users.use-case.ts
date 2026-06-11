import { inject } from '@angular/core';
import { ProfilesPermissionsFreeUsersAssignDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-free-users-assign.dto';
import { ProfilesPermissionsFreeUsersAssignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users-assign.entity';
import { ProfilesPermissionsFreeUsersEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users.entity';
import { ProfilesPermissionsFreeUsersRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-free-users-repository';
import { ProfilesPermissionsFreeUsersAssignVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-free-users-assign.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export class ProfilesPermissionsFreeUsersUseCase {
    private readonly repository = inject(
        ProfilesPermissionsFreeUsersRepository
    );

    execute(
        filter: null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ProfilesPermissionsFreeUsersEntity>> {
        return this.repository.execute(page, options);
    }

    assign(
        dto: ProfilesPermissionsFreeUsersAssignDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsFreeUsersAssignVo.fromDto(dto);
        const entity = ProfilesPermissionsFreeUsersAssignEntity.toEntity(vo);
        return this.repository.assign(entity);
    }
}
