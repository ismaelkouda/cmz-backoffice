import { Injectable, inject } from '@angular/core';
import { UsersFindOneQuery } from '@pages/settings-security/application/queries/users/users-find-one.query';
import { UsersFindOneUseCase } from '@pages/settings-security/application/use-cases/users/users-find-one.use-case';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersFindOneFilterHandler {
    private readonly useCase = inject(UsersFindOneUseCase);

    execute(command: UsersFindOneQuery): Observable<UsersFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
