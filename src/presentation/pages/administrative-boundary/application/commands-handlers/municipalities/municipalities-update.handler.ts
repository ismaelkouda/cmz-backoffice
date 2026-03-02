import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesUpdateCommand } from '@presentation/pages/administrative-boundary/application/commands/municipalities/municipalities-update.command';
import { MunicipalitiesUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/municipalities/municipalities.use-case';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesUpdateHandler {
    private readonly useCase = inject(MunicipalitiesUseCase);

    execute(
        command: MunicipalitiesUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            code: command.code,
            name: command.name,
            department: command.department,
            description: command.description,
        });
    }
}
