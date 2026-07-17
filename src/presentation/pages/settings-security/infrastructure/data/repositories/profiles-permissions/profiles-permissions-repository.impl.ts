import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsDeleteDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-delete.dto';
import { ProfilesPermissionsDisableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-disable.dto';
import { ProfilesPermissionsEnableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-enable.dto';
import { ProfilesPermissionsCreateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-create.validate-contract';
import { ProfilesPermissionsUpdateValidateContract } from '@pages/settings-security/domain/contracts/profiles-permissions/profiles-permissions-update.validate-contract';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { ProfilesPermissionsFilterVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-filter.vo';
import { profilesPermissionsCreateMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-create.mapper';
import { profilesPermissionsDeleteMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-delete.mapper';
import { profilesPermissionsDisableMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-disable.mapper';
import { profilesPermissionsEnableMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-enable.mapper';
import { ProfilesPermissionsFilterMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-filter.mapper';
import { profilesPermissionsUpdateMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-update.mapper';
import { ProfilesPermissionsMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions.mapper';
import { ProfilesPermissionsApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsRepositoryImpl implements ProfilesPermissionsRepository {
    private readonly api = inject(ProfilesPermissionsApi);
    private readonly mapper = inject(ProfilesPermissionsMapper);
    private readonly mapperFilter = inject(ProfilesPermissionsFilterMapper);

    execute(
        filter: ProfilesPermissionsFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ProfilesPermissionsEntity>> {
        const paramsDto = this.mapperFilter.map(filter);
        return this.api
            .readAll(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        props: ProfilesPermissionsCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsCreateMapper(props);
        return this.api.create(paramsDto);
    }

    update(
        props: ProfilesPermissionsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsUpdateMapper(props);
        return this.api.update(paramsDto);
    }

    delete(
        dto: ProfilesPermissionsDeleteDto
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsDeleteMapper(dto);
        return this.api.delete(paramsDto);
    }

    enable(
        dto: ProfilesPermissionsEnableDto
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsEnableMapper(dto);
        return this.api.enable(paramsDto);
    }

    disable(
        dto: ProfilesPermissionsDisableDto
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilesPermissionsDisableMapper(dto);
        return this.api.disable(paramsDto);
    }
}
