import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SlideFindOneQuery } from '@presentation/pages/content-management/application/queries/slide/slide-find-one.query';
import { SlideFindOneUseCase } from '@presentation/pages/content-management/application/use-cases/slide/slide-find-one.use-case';
import { SlideFindOneEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one.entity';

@Injectable({ providedIn: 'root' })
export class SlideFindOneHandler {
    constructor(private readonly useCase: SlideFindOneUseCase) {}

    execute(command: SlideFindOneQuery): Observable<SlideFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
