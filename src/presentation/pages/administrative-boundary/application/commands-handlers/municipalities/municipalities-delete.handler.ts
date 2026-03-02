import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesDeleteCommand } from '@presentation/pages/administrative-boundary/application/commands/municipalities/municipalities-delete.command';
import { MunicipalitiesUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/municipalities/municipalities.use-case';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesDeleteHandler {
    private readonly useCase = inject(MunicipalitiesUseCase);

    execute(
        command: MunicipalitiesDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
