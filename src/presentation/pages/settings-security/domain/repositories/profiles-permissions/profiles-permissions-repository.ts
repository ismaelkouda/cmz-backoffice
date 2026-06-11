import { Injectable } from '@angular/core';
import { ProfilesPermissionsCreateEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsDeleteEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-delete.entity';
import { ProfilesPermissionsDisableEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-disable.entity';
import { ProfilesPermissionsEnableEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-enable.entity';
import { ProfilesPermissionsFilterEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-filter.entity';
import { ProfilesPermissionsUpdateEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-update.entity';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ProfilesPermissionsRepository {
    abstract execute(
        entity: ProfilesPermissionsFilterEntity | null,
        page: string,
        options?: FetchOptions
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
