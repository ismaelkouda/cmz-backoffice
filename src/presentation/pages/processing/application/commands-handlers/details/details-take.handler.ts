import { Injectable, inject } from '@angular/core';
import { DetailsTakeCommand } from '@pages/processing/application/commands/details/details-take.command';
import { DetailsUseCase } from '@pages/processing/application/use-cases/details/details.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsTakeHandler {
    private readonly useCase = inject(DetailsUseCase);

    execute(command: DetailsTakeCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.take({
            uniqId: command.uniqId,
        });
    }
}
