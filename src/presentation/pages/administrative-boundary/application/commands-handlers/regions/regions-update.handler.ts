import { inject, Injectable } from '@angular/core';
import { RegionsUpdateCommand } from '@pages/administrative-boundary/application/commands/regions/regions-update.command';
import { RegionsUseCase } from '@pages/administrative-boundary/application/use-cases/regions/regions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsUpdateHandler {
    private readonly useCase = inject(RegionsUseCase);

    execute(
        command: RegionsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            code: command.code,
            population: command.population,
            infrastructure: command.infrastructure,
            name: command.name,
            description: command.description,
        });
    }
}
