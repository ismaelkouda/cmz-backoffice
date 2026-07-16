import { profilesPermissionsQueryMapper } from '@pages/settings-security/application/queries-mappers/profiles-permissions/profiles-permissions.mapper';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions.query';
import { ProfilesPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsHandler {
    private readonly useCase = inject(ProfilesPermissionsUseCase);

    execute(
        command: ProfilesPermissionsQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ProfilesPermissionsEntity>> {
        return this.useCase.execute(
            profilesPermissionsQueryMapper(command),
            page,
            options
        );
    }
}
