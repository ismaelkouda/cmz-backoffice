import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-permissions.use-case';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsHandler {
    private readonly useCase = inject(ProfilesPermissionsPermissionsUseCase);

    execute(): Observable<ProfilesPermissionsPermissionsEntity> {
        return this.useCase.execute();
    }
}
