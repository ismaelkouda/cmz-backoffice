import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsFreeUsersAssignEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users-assign.entity';
import { ProfilesPermissionsFreeUsersEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users.entity';
import { ProfilesPermissionsFreeUsersRepository } from '@presentation/pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-free-users-repository';
import { profilesPermissionsFreeUsersAssignMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-free-users-assign.mapper';
import { ProfilesPermissionsFreeUsersMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-free-users.mapper';
import { ProfilesPermissionsFreeUsersApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-free-users.api';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFreeUsersRepositoryImpl implements ProfilesPermissionsFreeUsersRepository {
    private readonly api = inject(ProfilesPermissionsFreeUsersApi);
    private readonly mapper = inject(ProfilesPermissionsFreeUsersMapper);

    execute(
        page: string
    ): Observable<Paginate<ProfilesPermissionsFreeUsersEntity>> {
        return this.api
            .readAll(page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    assign(
        dto: ProfilesPermissionsFreeUsersAssignEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = profilesPermissionsFreeUsersAssignMapper(dto);
        return this.api.assign(dtoApi);
    }
}
