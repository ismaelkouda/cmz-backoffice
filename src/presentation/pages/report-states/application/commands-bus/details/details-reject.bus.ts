import { Injectable } from '@angular/core';
import { DetailsRejectCommand } from '@pages/report-states/application/commands/details/details-reject.command';
import { DetailsRejectHandler } from '@pages/report-states/application/commands-handlers/details/details-reject.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
