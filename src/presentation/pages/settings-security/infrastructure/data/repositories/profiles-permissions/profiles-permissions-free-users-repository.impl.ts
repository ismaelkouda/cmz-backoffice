import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsFreeUsersAssignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users-assign.entity';
import { ProfilesPermissionsFreeUsersEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users.entity';
import { ProfilesPermissionsFreeUsersRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-free-users-repository';
import { profilesPermissionsFreeUsersAssignMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-free-users-assign.mapper';
import { ProfilesPermissionsFreeUsersMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-free-users.mapper';
import { ProfilesPermissionsFreeUsersApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-free-users.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

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
