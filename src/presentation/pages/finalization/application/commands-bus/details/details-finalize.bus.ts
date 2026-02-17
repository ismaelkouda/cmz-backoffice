import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsFinalizeCommand } from '@presentation/pages/finalization/application/commands/details/details-finalize.command';
import { DetailsFinalizeHandler } from '@presentation/pages/finalization/application/commands-handlers/details/details-finalize.handler';

@Injectable({ providedIn: 'root' })
export class DetailsFinalizeBus {
    constructor(private readonly createHandler: DetailsFinalizeHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsFinalizeCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
