import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { RegionsCreateCommand } from '@presentation/pages/administrative-boundary/application/commands/regions/regions-create.command';
import { RegionsCreateHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/regions/regions-create.handler';

@Injectable({ providedIn: 'root' })
export class RegionsCreateBus {
    constructor(private readonly createHandler: RegionsCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof RegionsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
