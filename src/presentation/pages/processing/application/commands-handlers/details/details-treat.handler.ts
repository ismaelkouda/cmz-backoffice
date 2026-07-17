import { detailsTreatCommandMapper } from '@pages/processing/application/commands-mappers/details/details-treat.mapper';
import { Injectable, inject } from '@angular/core';
import { DetailsTreatCommand } from '@pages/processing/application/commands/details/details-treat.command';
import { DetailsUseCase } from '@pages/processing/application/use-cases/details/details.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsTreatHandler {
    private readonly useCase = inject(DetailsUseCase);

    execute(command: DetailsTreatCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.treat(detailsTreatCommandMapper(command));
    }
}
