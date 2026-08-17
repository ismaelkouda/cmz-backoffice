import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-create.command';
import { InfrastructureTypeCreateHandler } from '@presentation/pages/administrative-infrastructure/application/commands-handlers/infrastructure-type/infrastructure-type-create.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeCreateBus {
    private readonly createHandler = inject(InfrastructureTypeCreateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof InfrastructureTypeCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
