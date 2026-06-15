import { inject, Injectable } from '@angular/core';
import { MunicipalitiesCreateCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-create.command';
import { MunicipalitiesUseCase } from '@pages/administrative-boundary/application/use-cases/municipalities/municipalities.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesCreateHandler {
    private readonly useCase = inject(MunicipalitiesUseCase);

    execute(
        command: MunicipalitiesCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            code: command.code,
            population: command.population,
            infrastructure: command.infrastructure,
            name: command.name,
            region: command.region,
            description: command.description,
            department: command?.department,
        });
    }
}
