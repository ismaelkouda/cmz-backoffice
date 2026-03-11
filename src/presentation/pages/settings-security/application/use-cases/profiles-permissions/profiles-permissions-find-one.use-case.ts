import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsFindOneFilterDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-find-one-filter.dto';
import { ProfilesPermissionsFindOneFilterEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one-filter.entity';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { ProfilesPermissionsFindOneRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-find-one-repository';
import { ProfilesPermissionsFindOneFilterVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-find-one-filter.vo';
import { Observable } from 'rxjs';

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
