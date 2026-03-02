import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { RegionsUpdateCommand } from '@presentation/pages/administrative-boundary/application/commands/regions/regions-update.command';
import { RegionsUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/regions/regions.use-case';

@Injectable({ providedIn: 'root' })
export class RegionsUpdateHandler {
    private readonly useCase = inject(RegionsUseCase);

    execute(
        command: RegionsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            code: command.code,
            name: command.name,
            description: command.description,
        });
    }
}
