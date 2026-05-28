import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsUsersQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions-users.query';
import { ProfilesPermissionsUsersUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';
import { ProfilesPermissionsUsersEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersHandler {
    private readonly useCase = inject(ProfilesPermissionsUsersUseCase);

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
