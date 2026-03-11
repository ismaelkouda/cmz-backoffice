import { Injectable } from '@angular/core';
import { DetailsQuery } from '@pages/processing/application/queries/details/details.query';
import { DetailsUseCase } from '@pages/processing/application/use-cases/details/details.use-case';
import { DetailsEntity } from '@pages/processing/domain/entities/details/details.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(command: DetailsQuery): Observable<DetailsEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
