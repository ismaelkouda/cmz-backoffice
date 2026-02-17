import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-find-one-filter.dto';
import { ProfilesPermissionsFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-find-one-filter.entity';
import { ProfilesPermissionsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { ProfilesPermissionsFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-find-one-repository';
import { ProfilesPermissionsFindOneFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsFindOneUseCase {
    private readonly repository = inject(ProfilesPermissionsFindOneRepository);

    execute(
        filterDto: ProfilesPermissionsFindOneFilterDto
    ): Observable<ProfilesPermissionsFindOneEntity> {
        const vo = ProfilesPermissionsFindOneFilterVo.fromDto(filterDto);
        const filter = ProfilesPermissionsFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
