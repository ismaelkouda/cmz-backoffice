import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsPermissionsEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { ProfilesPermissionsPermissionsRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-permissions-repository';

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
