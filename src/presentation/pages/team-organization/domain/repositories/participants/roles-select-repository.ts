import { Observable } from 'rxjs';

import { RolesSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/roles-select.entity';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export abstract class RolesSelectRepository {
    abstract readAll(): Observable<RolesSelectEntity[]>;
}
