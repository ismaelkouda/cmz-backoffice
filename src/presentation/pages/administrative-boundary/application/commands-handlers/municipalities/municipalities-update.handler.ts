import { inject, Injectable } from '@angular/core';
import { MunicipalitiesUpdateCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-update.command';
import { MunicipalitiesUseCase } from '@pages/administrative-boundary/application/use-cases/municipalities/municipalities.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesUpdateHandler {
    private readonly useCase = inject(MunicipalitiesUseCase);

    execute(
        command: MunicipalitiesUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
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
