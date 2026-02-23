import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesSelectEntity } from '@presentation/pages/settings-security/domain/entities/users/profiles-select.entity';
import { ProfilesSelectRepository } from '@presentation/pages/settings-security/domain/repositories/users/profiles-select-repository';

export class ProfilesSelectUseCase {
    private readonly repository = inject(ProfilesSelectRepository);

    readAll(): Observable<ProfilesSelectEntity[]> {
        return this.repository.readAll();
    }
}
