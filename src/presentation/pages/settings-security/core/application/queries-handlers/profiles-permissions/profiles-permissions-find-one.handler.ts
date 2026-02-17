import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsFindOneQuery } from '@presentation/pages/settings-security/core/application/queries/profiles-permissions/profiles-permissions-find-one.query';
import { ProfilesPermissionsFindOneUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions-find-one.use-case';
import { ProfilesPermissionsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';

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
