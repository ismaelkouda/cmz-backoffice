import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersQuery } from '@presentation/pages/settings-security/core/application/queries/profiles-permissions/profiles-permissions-users.query';
import { ProfilesPermissionsUsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';
import { ProfilesPermissionsUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-users.entity';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersHandler {
    constructor(private readonly useCase: ProfilesPermissionsUsersUseCase) {}

    execute(
        command: ProfilesPermissionsUsersQuery,
        page: string
    ): Observable<Paginate<ProfilesPermissionsUsersEntity>> {
        return this.useCase.execute(
            {
                uniqId: command.uniqId,
                search: command.search,
                userEmail: command.userEmail,
                phone: command.phone,
            },
            page
        );
    }
}
