import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsTakeCommand } from '@presentation/pages/requests/application/commands/details/details-take.command';
import { DetailsUseCase } from '@presentation/pages/requests/application/use-cases/details/details.use-case';

@Injectable({ providedIn: 'root' })
export class DetailsTakeHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(command: DetailsTakeCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.take({
            uniqId: command.uniqId,
        });
    }
}
