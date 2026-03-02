import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { RegionsCreateCommand } from '@presentation/pages/administrative-boundary/application/commands/regions/regions-create.command';
import { RegionsUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/regions/regions.use-case';

@Injectable({ providedIn: 'root' })
export class RegionsCreateHandler {
    private readonly useCase = inject(RegionsUseCase);

    execute(
        command: RegionsCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            code: command.code,
            name: command.name,
            description: command.description,
        });
    }
}
