import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsSelectEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { ProfilesPermissionsSelectRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-select-repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsSelectUseCase {
    private readonly repository = inject(ProfilesPermissionsSelectRepository);

    readAll(
        options?: FetchOptions
    ): Observable<ProfilesPermissionsSelectEntity[]> {
        return this.repository.readAll(options);
    }
}
