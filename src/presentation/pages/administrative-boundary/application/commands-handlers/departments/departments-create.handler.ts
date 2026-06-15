import { inject, Injectable } from '@angular/core';
import { DepartmentsCreateCommand } from '@pages/administrative-boundary/application/commands/departments/departments-create.command';
import { DepartmentsUseCase } from '@pages/administrative-boundary/application/use-cases/departments/departments.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsCreateHandler {
    private readonly useCase = inject(DepartmentsUseCase);

    execute(
        command: DepartmentsCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            code: command.code,
            population: command.population,
            infrastructure: command.infrastructure,
            name: command.name,
            region: command.region,
            description: command.description,
        });
    }
}
