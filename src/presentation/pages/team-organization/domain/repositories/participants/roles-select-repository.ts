import { Injectable } from '@angular/core';
import { RolesSelectEntity } from '@pages/team-organization/domain/entities/participants/roles-select.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class RolesSelectRepository {
    abstract readAll(): Observable<RolesSelectEntity[]>;
}
