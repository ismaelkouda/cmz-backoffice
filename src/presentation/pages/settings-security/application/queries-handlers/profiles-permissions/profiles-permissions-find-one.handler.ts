import { profilesPermissionsFindOneQueryMapper } from '@pages/settings-security/application/queries-mappers/profiles-permissions/profiles-permissions-find-one.mapper';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsFindOneQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions-find-one.query';
import { ProfilesPermissionsFindOneUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-find-one.use-case';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneHandler {
    private readonly useCase = inject(ProfilesPermissionsFindOneUseCase);

    execute(
        command: ProfilesPermissionsFindOneQuery,
        options?: FetchOptions
    ): Observable<ProfilesPermissionsFindOneEntity> {
        return this.useCase.execute(
            profilesPermissionsFindOneQueryMapper(command),
            options
        );
    }
}
