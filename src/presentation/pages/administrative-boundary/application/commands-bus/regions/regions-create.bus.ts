import { Injectable, inject } from '@angular/core';
import { RegionsCreateCommand } from '@pages/administrative-boundary/application/commands/regions/regions-create.command';
import { RegionsCreateHandler } from '@pages/administrative-boundary/application/commands-handlers/regions/regions-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsCreateBus {
    private readonly createHandler = inject(RegionsCreateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof RegionsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
