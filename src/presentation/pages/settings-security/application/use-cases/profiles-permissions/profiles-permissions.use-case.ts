import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsCreateDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-create.dto';
import { ProfilesPermissionsDeleteDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-delete.dto';
import { ProfilesPermissionsDisableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-disable.dto';
import { ProfilesPermissionsEnableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-enable.dto';
import { ProfilesPermissionsFilterDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-filter.dto';
import { ProfilesPermissionsUpdateDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-update.dto';
import { ProfilesPermissionsCreateEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsDeleteEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-delete.entity';
import { ProfilesPermissionsDisableEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-disable.entity';
import { ProfilesPermissionsEnableEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-enable.entity';
import { ProfilesPermissionsFilterEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-filter.entity';
import { ProfilesPermissionsUpdateEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-update.entity';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { ProfilesPermissionsCreateVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-create.vo';
import { ProfilesPermissionsDeleteVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-delete.vo';
import { ProfilesPermissionsDisableVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-disable.vo';
import { ProfilesPermissionsEnableVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-enable.vo';
import { ProfilesPermissionsFilterVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-filter.vo';
import { ProfilesPermissionsUpdateVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

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
        const vo = ProfilesPermissionsFilterVo.fromDto(dto);
        const entity = ProfilesPermissionsFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }

    create(
        dto: ProfilesPermissionsCreateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsCreateVo.fromDto(dto);
        const entity = ProfilesPermissionsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(
        dto: ProfilesPermissionsUpdateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsUpdateVo.fromDto(dto);
        const entity = ProfilesPermissionsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    enable(
        dto: ProfilesPermissionsEnableDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsEnableVo.fromDto(dto);
        const entity = ProfilesPermissionsEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(
        dto: ProfilesPermissionsDisableDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsDisableVo.fromDto(dto);
        const entity = ProfilesPermissionsDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }

    delete(
        dto: ProfilesPermissionsDeleteDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilesPermissionsDeleteVo.fromDto(dto);
        const entity = ProfilesPermissionsDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
