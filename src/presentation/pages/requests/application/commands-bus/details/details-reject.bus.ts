import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsRejectCommand } from '@presentation/pages/requests/application/commands/details/details-reject.command';
import { DetailsRejectHandler } from '@presentation/pages/requests/application/commands-handlers/details/details-reject.handler';

@Injectable({ providedIn: 'root' })
export class DetailsRejectBus {
    constructor(private readonly createHandler: DetailsRejectHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsRejectCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
