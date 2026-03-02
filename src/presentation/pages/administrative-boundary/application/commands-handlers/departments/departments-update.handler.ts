import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DepartmentsUpdateCommand } from '@presentation/pages/administrative-boundary/application/commands/departments/departments-update.command';
import { DepartmentsUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/departments/departments.use-case';

@Injectable({ providedIn: 'root' })
export class DepartmentsUpdateHandler {
    private readonly useCase = inject(DepartmentsUseCase);

    execute(
        command: DepartmentsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            code: command.code,
            name: command.name,
            region: command.region,
            description: command.description,
        });
    }
}
