import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsTakeCommand } from '@presentation/pages/requests/application/commands/details/details-take.command';
import { DetailsTakeHandler } from '@presentation/pages/requests/application/commands-handlers/details/details-take.handler';

@Injectable({ providedIn: 'root' })
export class DetailsTakeBus {
    constructor(private readonly createHandler: DetailsTakeHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsTakeCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
