import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsCreateDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-create.dto';
import { ProfilesPermissionsDeleteDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-delete.dto';
import { ProfilesPermissionsDisableDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-disable.dto';
import { ProfilesPermissionsEnableDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-enable.dto';
import { ProfilesPermissionsFilterDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-filter.dto';
import { ProfilesPermissionsUpdateDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-update.dto';
import { ProfilesPermissionsCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsDeleteEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-delete.entity';
import { ProfilesPermissionsDisableEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-disable.entity';
import { ProfilesPermissionsEnableEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-enable.entity';
import { ProfilesPermissionsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-filter.entity';
import { ProfilesPermissionsUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-update.entity';
import { ProfilesPermissionsEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { ProfilesPermissionsCreateVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-create.vo';
import { ProfilesPermissionsDeleteVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-delete.vo';
import { ProfilesPermissionsDisableVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-disable.vo';
import { ProfilesPermissionsEnableVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-enable.vo';
import { ProfilesPermissionsFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-filter.vo';
import { ProfilesPermissionsUpdateVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-update.vo';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsUseCase {
    private readonly repository = inject(ProfilesPermissionsRepository);

    execute(
        dto: ProfilesPermissionsFilterDto | null,
        page: string
    ): Observable<Paginate<ProfilesPermissionsEntity>> {
        const vo = ProfilesPermissionsFilterVo.fromDto(dto);
        const entity = ProfilesPermissionsFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
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
