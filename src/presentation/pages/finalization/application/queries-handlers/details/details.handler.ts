import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DetailsQuery } from '@presentation/pages/finalization/application/queries/details/details.query';
import { DetailsUseCase } from '@presentation/pages/finalization/application/use-cases/details/details.use-case';
import { DetailsEntity } from '@presentation/pages/finalization/domain/entities/details/details.entity';

@Injectable({ providedIn: 'root' })
export class DetailsHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(command: DetailsQuery): Observable<DetailsEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
