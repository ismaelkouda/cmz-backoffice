import { Injectable, inject } from '@angular/core';
import { DetailsApproveCommand } from '@pages/report-states/application/commands/details/details-approve.command';
import { DetailsApproveHandler } from '@pages/report-states/application/commands-handlers/details/details-approve.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsApproveBus {
    private readonly createHandler = inject(DetailsApproveHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsApproveCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
