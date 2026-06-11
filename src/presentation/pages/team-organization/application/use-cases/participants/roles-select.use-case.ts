import { inject, Injectable } from '@angular/core';
import { RolesSelectEntity } from '@pages/team-organization/domain/entities/participants/roles-select.entity';
import { RolesSelectRepository } from '@pages/team-organization/domain/repositories/participants/roles-select-repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RolesSelectUseCase {
    private readonly repository = inject(RolesSelectRepository);

    readAll(options?: FetchOptions): Observable<RolesSelectEntity[]> {
        return this.repository.readAll(options);
    }
}
