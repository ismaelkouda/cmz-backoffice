import { Injectable, inject } from '@angular/core';
import { InfrastructureCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-create.command';
import { InfrastructureCreateHandler } from '@presentation/pages/administrative-infrastructure/application/commands-handlers/infrastructure/infrastructure-create.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureCreateBus {
    private readonly createHandler = inject(InfrastructureCreateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof InfrastructureCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
