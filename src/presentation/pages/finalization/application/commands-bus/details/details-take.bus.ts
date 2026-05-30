import { Injectable, inject } from '@angular/core';
import { DetailsTakeCommand } from '@pages/finalization/application/commands/details/details-take.command';
import { DetailsTakeHandler } from '@pages/finalization/application/commands-handlers/details/details-take.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsTakeBus {
    private readonly takeHandler = inject(DetailsTakeHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsTakeCommand) {
            return this.takeHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
