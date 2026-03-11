import { Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-permissions.use-case';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsHandler {
    constructor(
        private readonly useCase: ProfilesPermissionsPermissionsUseCase
    ) {}

    execute(): Observable<ProfilesPermissionsPermissionsEntity> {
        return this.useCase.execute();
    }
}
