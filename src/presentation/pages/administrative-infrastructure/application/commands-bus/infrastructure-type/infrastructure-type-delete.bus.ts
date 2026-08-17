import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-delete.command';
import { InfrastructureTypeDeleteHandler } from '@presentation/pages/administrative-infrastructure/application/commands-handlers/infrastructure-type/infrastructure-type-delete.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeDeleteBus {
    private readonly filterHandler = inject(InfrastructureTypeDeleteHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof InfrastructureTypeDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
