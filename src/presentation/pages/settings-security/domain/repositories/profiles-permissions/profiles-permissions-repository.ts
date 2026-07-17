import { Injectable } from '@angular/core';
import { ProfilesPermissionsDeleteDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-delete.dto';
import { ProfilesPermissionsDisableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-disable.dto';
import { ProfilesPermissionsEnableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-enable.dto';
import { ProfilesPermissionsCreateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-create.validate-contract';
import { ProfilesPermissionsUpdateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-update.validate-contract';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsFilterVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-filter.vo';
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
        filter: ProfilesPermissionsFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ProfilesPermissionsEntity>>;
    abstract create(
        props: ProfilesPermissionsCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        props: ProfilesPermissionsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        dto: ProfilesPermissionsDeleteDto
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        dto: ProfilesPermissionsEnableDto
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        dto: ProfilesPermissionsDisableDto
    ): Observable<SimpleResponseDto<void>>;
}
