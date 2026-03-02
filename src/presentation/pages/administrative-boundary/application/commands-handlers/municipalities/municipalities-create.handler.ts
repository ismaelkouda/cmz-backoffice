import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesCreateCommand } from '@presentation/pages/administrative-boundary/application/commands/municipalities/municipalities-create.command';
import { MunicipalitiesUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/municipalities/municipalities.use-case';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesCreateHandler {
    private readonly useCase = inject(MunicipalitiesUseCase);

    execute(
        command: MunicipalitiesCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            code: command.code,
            name: command.name,
            department: command.department,
            description: command.description,
        });
    }
}
