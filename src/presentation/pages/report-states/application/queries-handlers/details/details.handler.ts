import { Injectable } from '@angular/core';
import { DetailsQuery } from '@pages/report-states/application/queries/details/details.query';
import { DetailsUseCase } from '@pages/report-states/application/use-cases/details/details.use-case';
import { DetailsEntity } from '@pages/report-states/domain/entities/details/details.entity';
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
