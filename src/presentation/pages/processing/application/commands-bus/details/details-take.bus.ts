import { Injectable, inject } from '@angular/core';
import { DetailsTakeCommand } from '@pages/processing/application/commands/details/details-take.command';
import { DetailsTakeHandler } from '@pages/processing/application/commands-handlers/details/details-take.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsTakeBus {
    private readonly createHandler = inject(DetailsTakeHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsTakeCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
