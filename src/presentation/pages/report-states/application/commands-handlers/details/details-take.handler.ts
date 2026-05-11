import { Injectable } from '@angular/core';
import { DetailsTakeCommand } from '@pages/report-states/application/commands/details/details-take.command';
import { DetailsUseCase } from '@pages/report-states/application/use-cases/details/details.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsTakeHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(command: DetailsTakeCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.take({
            uniqId: command.uniqId,
        });
    }
}
