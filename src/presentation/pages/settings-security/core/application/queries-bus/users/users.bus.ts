import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { UsersQuery } from '@presentation/pages/settings-security/core/application/queries/users/users.query';
import { UsersHandler } from '@presentation/pages/settings-security/core/application/queries-handlers/users/users.handler';
import { UsersEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users.entity';

@Injectable({ providedIn: 'root' })
export class UsersBus {
    constructor(private readonly filterHandler: UsersHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<UsersEntity>> {
        if (query instanceof UsersQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
