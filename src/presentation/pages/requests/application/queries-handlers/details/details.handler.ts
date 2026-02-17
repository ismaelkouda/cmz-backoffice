import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DetailsQuery } from '@presentation/pages/requests/application/queries/details/details.query';
import { DetailsUseCase } from '@presentation/pages/requests/application/use-cases/details/details.use-case';
import { DetailsEntity } from '@presentation/pages/requests/domain/entities/details/details.entity';

@Injectable({ providedIn: 'root' })
export class DetailsHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(command: DetailsQuery): Observable<DetailsEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
