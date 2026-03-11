import { Injectable } from '@angular/core';
import { UsersQuery } from '@pages/settings-security/application/queries/users/users.query';
import { UsersHandler } from '@pages/settings-security/application/queries-handlers/users/users.handler';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
