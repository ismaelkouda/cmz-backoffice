import { Injectable, inject } from '@angular/core';
import { InfrastructureDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-delete.command';
import { InfrastructureDeleteHandler } from '@presentation/pages/administrative-infrastructure/application/commands-handlers/infrastructure/infrastructure-delete.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureDeleteBus {
    private readonly filterHandler = inject(InfrastructureDeleteHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof InfrastructureDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
