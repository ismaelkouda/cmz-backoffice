import { Injectable } from '@angular/core';
import { HomeFindOneQuery } from '@pages/content-management/application/queries/home/home-find-one.query';
import { HomeFindOneUseCase } from '@pages/content-management/application/use-cases/home/home-find-one.use-case';
import { HomeFindOneEntity } from '@pages/content-management/domain/entities/home/home-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeFindOneHandler {
    constructor(private readonly useCase: HomeFindOneUseCase) {}

    execute(command: HomeFindOneQuery): Observable<HomeFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
