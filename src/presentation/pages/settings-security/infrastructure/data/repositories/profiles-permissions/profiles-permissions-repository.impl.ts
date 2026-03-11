import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsCreateEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-create.entity';
import { ProfilesPermissionsDeleteEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-delete.entity';
import { ProfilesPermissionsDisableEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-disable.entity';
import { ProfilesPermissionsEnableEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-enable.entity';
import { ProfilesPermissionsFilterEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-filter.entity';
import { ProfilesPermissionsUpdateEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-update.entity';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { profilesPermissionsCreateMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-create.mapper';
import { profilesPermissionsDeleteMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-delete.mapper';
import { profilesPermissionsDisableMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-disable.mapper';
import { profilesPermissionsEnableMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-enable.mapper';
import { profilesPermissionsFilterMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-filter.mapper';
import { profilesPermissionsUpdateMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-update.mapper';
import { ProfilesPermissionsMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions.mapper';
import { ProfilesPermissionsApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

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
