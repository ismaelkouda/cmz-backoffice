import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HomeFindOneQuery } from '@presentation/pages/content-management/application/queries/home/home-find-one.query';
import { HomeFindOneUseCase } from '@presentation/pages/content-management/application/use-cases/home/home-find-one.use-case';
import { HomeFindOneEntity } from '@presentation/pages/content-management/domain/entities/home/home-find-one.entity';

@Injectable({ providedIn: 'root' })
export class HomeFindOneHandler {
    constructor(private readonly useCase: HomeFindOneUseCase) {}

    execute(command: HomeFindOneQuery): Observable<HomeFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
