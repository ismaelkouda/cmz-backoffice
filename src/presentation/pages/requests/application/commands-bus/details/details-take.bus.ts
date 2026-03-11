import { Injectable } from '@angular/core';
import { DetailsTakeCommand } from '@pages/requests/application/commands/details/details-take.command';
import { DetailsTakeHandler } from '@pages/requests/application/commands-handlers/details/details-take.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsTakeBus {
    constructor(private readonly createHandler: DetailsTakeHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        console.log('command: ', command instanceof DetailsTakeCommand);
        if (command instanceof DetailsTakeCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
