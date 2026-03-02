import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { RegionsUpdateCommand } from '@presentation/pages/administrative-boundary/application/commands/regions/regions-update.command';
import { RegionsUpdateHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/regions/regions-update.handler';

@Injectable({ providedIn: 'root' })
export class RegionsUpdateBus {
    constructor(private readonly updateHandler: RegionsUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof RegionsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
