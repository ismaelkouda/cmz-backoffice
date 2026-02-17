import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsDeleteEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-delete.entity';
import { ProfilesPermissionsDisableEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-disable.entity';
import { ProfilesPermissionsEnableEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-enable.entity';
import { ProfilesPermissionsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-filter.entity';
import { ProfilesPermissionsUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-update.entity';
import { ProfilesPermissionsEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class ProfilesPermissionsRepository {
    abstract execute(
        entity: ProfilesPermissionsFilterEntity | null,
        page: string
    ): Observable<Paginate<ProfilesPermissionsEntity>>;
    abstract create(
        entity: ProfilesPermissionsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: ProfilesPermissionsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: ProfilesPermissionsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: ProfilesPermissionsEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: ProfilesPermissionsDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
