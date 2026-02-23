import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsersFindOneQuery } from '@presentation/pages/settings-security/application/queries/users/users-find-one.query';
import { UsersFindOneUseCase } from '@presentation/pages/settings-security/application/use-cases/users/users-find-one.use-case';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/domain/entities/users/users-find-one.entity';

@Injectable({ providedIn: 'root' })
export class UsersFindOneHandler {
    constructor(private readonly useCase: UsersFindOneUseCase) {}

    execute(command: UsersFindOneQuery): Observable<UsersFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
