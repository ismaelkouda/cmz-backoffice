import { inject, Injectable } from '@angular/core';
import { SlaThresholdUpdateCommand } from '@pages/sla/application/commands/sla-thresholds/sla-threshold-update.command';
import { SlaThresholdUseCase } from '@pages/sla/application/use-cases/sla/sla-threshold.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { slaThresholdUpdateMapper } from '@pages/sla/application/commands-mappers/sla-threshold-update.mapper';

@Injectable({ providedIn: 'root' })
export class SlaThresholdUpdateHandler {
    private readonly useCase = inject(SlaThresholdUseCase);

    execute(
        command: SlaThresholdUpdateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.update(slaThresholdUpdateMapper(command));
    }
}
