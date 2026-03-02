import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DepartmentsDeleteCommand } from '@presentation/pages/administrative-boundary/application/commands/departments/departments-delete.command';
import { DepartmentsUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/departments/departments.use-case';

@Injectable({ providedIn: 'root' })
export class DepartmentsDeleteHandler {
    private readonly useCase = inject(DepartmentsUseCase);

    execute(
        command: DepartmentsDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
