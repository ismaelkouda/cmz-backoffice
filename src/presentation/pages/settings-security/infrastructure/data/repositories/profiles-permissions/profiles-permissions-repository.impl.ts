import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsCreateEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsDeleteEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-delete.entity';
import { ProfilesPermissionsDisableEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-disable.entity';
import { ProfilesPermissionsEnableEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-enable.entity';
import { ProfilesPermissionsFilterEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-filter.entity';
import { ProfilesPermissionsUpdateEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-update.entity';
import { ProfilesPermissionsEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsRepository } from '@presentation/pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { profilesPermissionsCreateMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-create.mapper';
import { profilesPermissionsDeleteMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-delete.mapper';
import { profilesPermissionsDisableMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-disable.mapper';
import { profilesPermissionsEnableMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-enable.mapper';
import { profilesPermissionsFilterMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-filter.mapper';
import { profilesPermissionsUpdateMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-update.mapper';
import { ProfilesPermissionsMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions.mapper';
import { ProfilesPermissionsApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions.api';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsRepositoryImpl implements ProfilesPermissionsRepository {
    private readonly api = inject(ProfilesPermissionsApi);
    private readonly mapper = inject(ProfilesPermissionsMapper);

    execute(
        entity: ProfilesPermissionsFilterEntity,
        page: string
    ): Observable<Paginate<ProfilesPermissionsEntity>> {
        const paramsDto = profilesPermissionsFilterMapper(entity);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        entity: ProfilesPermissionsCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsCreateMapper(entity);
        return this.api.create(paramsDto);
    }

    update(
        entity: ProfilesPermissionsUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsUpdateMapper(entity);
        return this.api.update(paramsDto);
    }

    delete(
        entity: ProfilesPermissionsDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsDeleteMapper(entity);
        return this.api.delete(paramsDto);
    }

    enable(
        entity: ProfilesPermissionsEnableEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsEnableMapper(entity);
        return this.api.enable(paramsDto);
    }

    disable(
        entity: ProfilesPermissionsDisableEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsDisableMapper(entity);
        return this.api.disable(paramsDto);
    }
}
