import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeEnableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-enable.command';
import { InfrastructureTypeEnableHandler } from '@presentation/pages/administrative-infrastructure/application/commands-handlers/infrastructure-type/infrastructure-type-enable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeEnableBus {
    private readonly filterHandler = inject(InfrastructureTypeEnableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof InfrastructureTypeEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
