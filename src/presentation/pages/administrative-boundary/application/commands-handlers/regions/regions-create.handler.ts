import { inject, Injectable } from '@angular/core';
import { RegionsCreateCommand } from '@pages/administrative-boundary/application/commands/regions/regions-create.command';
import { RegionsUseCase } from '@pages/administrative-boundary/application/use-cases/regions/regions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsCreateHandler {
    private readonly useCase = inject(RegionsUseCase);

    execute(
        command: RegionsCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            code: command.code,
            population: command.population,
            infrastructure: command.infrastructure,
            name: command.name,
            description: command.description,
        });
    }
}
