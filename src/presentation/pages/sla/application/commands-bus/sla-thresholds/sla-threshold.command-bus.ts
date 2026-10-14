import { Injectable, inject } from '@angular/core';
import { SlaThresholdUpdateCommand } from '@pages/sla/application/commands/sla-thresholds/sla-threshold-update.command';
import { SlaThresholdUpdateHandler } from '@pages/sla/application/commands-handlers/sla-thresholds/sla-threshold-update.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaThresholdCommandBus {
    private readonly handler = inject(SlaThresholdUpdateHandler);

    dispatch(
        command: SlaThresholdUpdateCommand
    ): Observable<MessageResponseDto> {
        if (command instanceof SlaThresholdUpdateCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
