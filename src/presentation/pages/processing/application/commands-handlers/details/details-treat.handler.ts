import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsTreatCommand } from '@presentation/pages/processing/application/commands/details/details-treat.command';
import { DetailsUseCase } from '@presentation/pages/processing/application/use-cases/details/details.use-case';

@Injectable({ providedIn: 'root' })
export class DetailsTreatHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(command: DetailsTreatCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.treat({
            uniqId: command.uniqId,
            comment: command.comment,
        });
    }
}
