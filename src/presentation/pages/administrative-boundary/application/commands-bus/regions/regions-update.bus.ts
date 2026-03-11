import { Injectable } from '@angular/core';
import { RegionsUpdateCommand } from '@pages/administrative-boundary/application/commands/regions/regions-update.command';
import { RegionsUpdateHandler } from '@pages/administrative-boundary/application/commands-handlers/regions/regions-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
