import { Injectable, inject } from '@angular/core';
import { UsersFindOneQuery } from '@pages/settings-security/application/queries/users/users-find-one.query';
import { UsersFindOneHandler } from '@pages/settings-security/application/queries-handlers/users/users-find-one.handler';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class UsersFindOneBus {
    private readonly filterHandler = inject(UsersFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<UsersFindOneEntity> {
        if (query instanceof UsersFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
