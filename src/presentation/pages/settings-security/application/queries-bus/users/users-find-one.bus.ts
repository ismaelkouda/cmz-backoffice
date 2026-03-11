import { Injectable } from '@angular/core';
import { UsersFindOneQuery } from '@pages/settings-security/application/queries/users/users-find-one.query';
import { UsersFindOneHandler } from '@pages/settings-security/application/queries-handlers/users/users-find-one.handler';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersFindOneBus {
    constructor(private readonly filterHandler: UsersFindOneHandler) {}

    dispatch<T>(query: T): Observable<UsersFindOneEntity> {
        if (query instanceof UsersFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
