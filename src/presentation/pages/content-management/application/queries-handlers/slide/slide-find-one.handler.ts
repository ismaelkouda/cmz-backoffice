import { Injectable } from '@angular/core';
import { SlideFindOneQuery } from '@pages/content-management/application/queries/slide/slide-find-one.query';
import { SlideFindOneUseCase } from '@pages/content-management/application/use-cases/slide/slide-find-one.use-case';
import { SlideFindOneEntity } from '@pages/content-management/domain/entities/slide/slide-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideFindOneHandler {
    constructor(private readonly useCase: SlideFindOneUseCase) {}

    execute(command: SlideFindOneQuery): Observable<SlideFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
