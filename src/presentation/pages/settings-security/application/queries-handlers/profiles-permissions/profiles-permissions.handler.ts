import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsQuery } from '@presentation/pages/settings-security/application/queries/profiles-permissions/profiles-permissions.query';
import { ProfilesPermissionsUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { ProfilesPermissionsEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsHandler {
    constructor(private readonly useCase: ProfilesPermissionsUseCase) {}

    execute(
        command: ProfilesPermissionsQuery,
        page: string
    ): Observable<Paginate<ProfilesPermissionsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                user: command.user,
                isActive: command.isActive,
            },
            page
        );
    }
}
