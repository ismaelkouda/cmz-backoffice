import { inject, Injectable } from '@angular/core';
import { DepartmentsUpdateCommand } from '@pages/administrative-boundary/application/commands/departments/departments-update.command';
import { DepartmentsUseCase } from '@pages/administrative-boundary/application/use-cases/departments/departments.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsUpdateHandler {
    private readonly useCase = inject(DepartmentsUseCase);

    execute(
        command: DepartmentsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            code: command.code,
            population: command.population,
            infrastructure: command.infrastructure,
            name: command.name,
            region: command.region,
            description: command.description,
        });
    }
}
