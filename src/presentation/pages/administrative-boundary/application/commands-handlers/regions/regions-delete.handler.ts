import { inject, Injectable } from '@angular/core';
import { RegionsDeleteCommand } from '@pages/administrative-boundary/application/commands/regions/regions-delete.command';
import { RegionsUseCase } from '@pages/administrative-boundary/application/use-cases/regions/regions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
