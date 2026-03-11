import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsUsersAssignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-assign.entity';
import { ProfilesPermissionsUsersFilterEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-filter.entity';
import { ProfilesPermissionsUsersReassignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-reassign.entity';
import { ProfilesPermissionsUsersRemoveEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-remove.entity';
import { ProfilesPermissionsUsersEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';
import { ProfilesPermissionsUsersRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-users-repository';
import { profilesPermissionsUsersAssignMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-users-assign.mapper';
import { profilesPermissionsUsersFilterMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-users-filter.mapper';
import { profilesPermissionsUsersReassignMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-users-reassign.mapper';
import { profilesPermissionsUsersRemoveMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-users-remove.mapper';
import { ProfilesPermissionsUsersMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-users.mapper';
import { ProfilesPermissionsUsersApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-users.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersRepositoryImpl implements ProfilesPermissionsUsersRepository {
    private readonly api = inject(ProfilesPermissionsUsersApi);
    private readonly mapper = inject(ProfilesPermissionsUsersMapper);

    execute(
        filter: ProfilesPermissionsUsersFilterEntity,
        page: string
    ): Observable<Paginate<ProfilesPermissionsUsersEntity>> {
        const paramsDto = profilesPermissionsUsersFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    reassign(
        dto: ProfilesPermissionsUsersReassignEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = profilesPermissionsUsersReassignMapper(dto);
        return this.api.reassign(dtoApi);
    }

    assign(
        dto: ProfilesPermissionsUsersAssignEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = profilesPermissionsUsersAssignMapper(dto);
        return this.api.assign(dtoApi);
    }

    remove(
        dto: ProfilesPermissionsUsersRemoveEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = profilesPermissionsUsersRemoveMapper(dto);
        return this.api.remove(dtoApi);
    }
}
