import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsSelectEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { ProfilesPermissionsSelectRepository } from '@presentation/pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-select-repository';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsSelectUseCase {
    private readonly repository = inject(ProfilesPermissionsSelectRepository);

    readAll(): Observable<ProfilesPermissionsSelectEntity[]> {
        return this.repository.readAll();
    }
}
