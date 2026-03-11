import { Injectable } from '@angular/core';
import { DetailsApproveCommand } from '@pages/requests/application/commands/details/details-approve.command';
import { DetailsApproveHandler } from '@pages/requests/application/commands-handlers/details/details-approve.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsApproveBus {
    constructor(private readonly createHandler: DetailsApproveHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsApproveCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
