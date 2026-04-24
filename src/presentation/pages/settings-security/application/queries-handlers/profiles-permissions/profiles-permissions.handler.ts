import { Injectable } from '@angular/core';
import { ProfilesPermissionsQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions.query';
import { ProfilesPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
                status: command.status,
            },
            page
        );
    }
}
