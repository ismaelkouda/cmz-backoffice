import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsDeleteDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-delete.dto';
import { ProfilesPermissionsDisableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-disable.dto';
import { ProfilesPermissionsEnableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-enable.dto';
import { ProfilesPermissionsFilterDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-filter.dto';
import { ProfilesPermissionsCreateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-create.contract';
import { ProfilesPermissionsUpdateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-update.contract';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { profilesPermissionsCreateVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-create.vo';
import { profilesPermissionsDeleteVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-delete.vo';
import { profilesPermissionsDisableVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-disable.vo';
import { profilesPermissionsEnableVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-enable.vo';
import { profilesPermissionsFilterVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-filter.vo';
import { profilesPermissionsUpdateVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsUseCase {
    private readonly repository = inject(ProfilesPermissionsRepository);

    execute(
        dto: ProfilesPermissionsFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ProfilesPermissionsEntity>> {
        return this.repository.execute(
            profilesPermissionsFilterVo(dto),
            page,
            options
        );
    }

    create(
        dto: ProfilesPermissionsCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() =>
            this.repository.create(profilesPermissionsCreateVo(dto))
        );
    }

    update(
        dto: ProfilesPermissionsUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() =>
            this.repository.update(profilesPermissionsUpdateVo(dto))
        );
    }

    enable(
        dto: ProfilesPermissionsEnableDto
    ): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(profilesPermissionsEnableVo(dto));
    }

    disable(
        dto: ProfilesPermissionsDisableDto
    ): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(profilesPermissionsDisableVo(dto));
    }

    delete(
        dto: ProfilesPermissionsDeleteDto
    ): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(profilesPermissionsDeleteVo(dto));
    }
}
