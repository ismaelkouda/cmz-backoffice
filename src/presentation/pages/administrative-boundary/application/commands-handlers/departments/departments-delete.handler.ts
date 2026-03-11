import { inject, Injectable } from '@angular/core';
import { DepartmentsDeleteCommand } from '@pages/administrative-boundary/application/commands/departments/departments-delete.command';
import { DepartmentsUseCase } from '@pages/administrative-boundary/application/use-cases/departments/departments.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
