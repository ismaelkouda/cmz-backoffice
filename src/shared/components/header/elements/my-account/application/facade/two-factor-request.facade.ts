import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { TwoFactorRequestDto } from '../dto/two-factor-request.dto';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { TwoFactorRequestBus } from '../commands-bus/two-factor-request.bus';
import { TwoFactorRequestCommand } from '../commands/two-factor-request.command';
import { TwoFactorRequestResultEntity } from '../../domain/entities/two-factor-request-result.entity';

@Injectable({ providedIn: 'root' })
export class TwoFactorRequestFacade extends ObjectBaseFacade<
    TwoFactorRequestResultEntity,
    TwoFactorRequestDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(TwoFactorRequestBus);

    execute(dto: TwoFactorRequestDto): void {
        const command = new TwoFactorRequestCommand(dto.userId, dto.email);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui);
    }
}
