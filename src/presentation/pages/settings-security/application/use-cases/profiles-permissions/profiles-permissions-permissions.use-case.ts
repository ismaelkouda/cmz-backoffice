import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { ProfilesPermissionsPermissionsRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-permissions-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsPermissionsUseCase {
    private readonly repository = inject(
        ProfilesPermissionsPermissionsRepository
    );

    execute(): Observable<ProfilesPermissionsPermissionsEntity> {
        return this.repository.execute();
    }
}
