import { Injectable } from '@angular/core';
import { ProfilesPermissionsFindOneQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions-find-one.query';
import { ProfilesPermissionsFindOneUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-find-one.use-case';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneHandler {
    constructor(private readonly useCase: ProfilesPermissionsFindOneUseCase) {}

    execute(
        command: ProfilesPermissionsFindOneQuery
    ): Observable<ProfilesPermissionsFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
