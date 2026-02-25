import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DepartmentsCreateCommand } from '@presentation/pages/administrative-boundary/application/commands/departments/departments-create.command';
import { DepartmentsUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/departments/departments.use-case';

@Injectable({ providedIn: 'root' })
export class DepartmentsCreateHandler {
    private readonly useCase = inject(DepartmentsUseCase);

    execute(
        command: DepartmentsCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            code: command.code,
            name: command.name,
            region: command.region,
            description: command.description,
        });
    }
}
