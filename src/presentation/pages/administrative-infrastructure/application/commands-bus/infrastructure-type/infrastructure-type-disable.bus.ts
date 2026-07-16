import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeDisableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-disable.command';
import { InfrastructureTypeDisableHandler } from '@presentation/pages/administrative-infrastructure/application/commands-handlers/infrastructure-type/infrastructure-type-disable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeDisableBus {
    private readonly filterHandler = inject(InfrastructureTypeDisableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof InfrastructureTypeDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
