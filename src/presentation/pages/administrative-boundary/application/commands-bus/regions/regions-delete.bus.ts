import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { RegionsDeleteCommand } from '@presentation/pages/administrative-boundary/application/commands/regions/regions-delete.command';
import { RegionsDeleteHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/regions/regions-delete.handler';

@Injectable({ providedIn: 'root' })
export class RegionsDeleteBus {
    constructor(private readonly deleteHandler: RegionsDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof RegionsDeleteCommand) {
            return this.deleteHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
