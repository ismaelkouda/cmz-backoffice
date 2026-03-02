import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { RegionsDeleteCommand } from '@presentation/pages/administrative-boundary/application/commands/regions/regions-delete.command';
import { RegionsUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/regions/regions.use-case';

@Injectable({ providedIn: 'root' })
export class RegionsDeleteHandler {
    private readonly useCase = inject(RegionsUseCase);

    execute(
        command: RegionsDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
