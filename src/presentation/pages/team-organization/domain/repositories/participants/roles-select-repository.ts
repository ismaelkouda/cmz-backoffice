import { Injectable } from '@angular/core';
import { RolesSelectEntity } from '@pages/team-organization/domain/entities/participants/roles-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class RolesSelectRepository {
    abstract readAll(options?: FetchOptions): Observable<RolesSelectEntity[]>;
}
