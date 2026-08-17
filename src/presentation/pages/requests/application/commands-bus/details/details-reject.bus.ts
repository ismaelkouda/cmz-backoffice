import { Injectable, inject } from '@angular/core';
import { DetailsRejectCommand } from '@pages/requests/application/commands/details/details-reject.command';
import { DetailsRejectHandler } from '@pages/requests/application/commands-handlers/details/details-reject.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsRejectBus {
    private readonly createHandler = inject(DetailsRejectHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsRejectCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
