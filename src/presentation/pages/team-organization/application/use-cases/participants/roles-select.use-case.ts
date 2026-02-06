import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RolesSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/roles-select.entity';
import { RolesSelectRepository } from '@presentation/pages/team-organization/domain/repositories/participants/roles-select-repository';

@Injectable({
    providedIn: 'root',
})
export class RolesSelectUseCase {
    private readonly repository = inject(RolesSelectRepository);

    readAll(): Observable<RolesSelectEntity[]> {
        return this.repository.readAll();
    }
}
