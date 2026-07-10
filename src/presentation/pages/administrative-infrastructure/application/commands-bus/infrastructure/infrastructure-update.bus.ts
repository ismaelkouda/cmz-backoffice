import { Injectable, inject } from '@angular/core';
import { InfrastructureUpdateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-update.command';
import { InfrastructureUpdateHandler } from '@presentation/pages/administrative-infrastructure/application/commands-handlers/infrastructure/infrastructure-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureUpdateBus {
    private readonly updateHandler = inject(InfrastructureUpdateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof InfrastructureUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
