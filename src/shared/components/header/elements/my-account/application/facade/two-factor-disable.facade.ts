import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorDisableDto } from '../dto/two-factor-disable.dto';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { TwoFactorDisableBus } from '../commands-bus/two-factor-disable.bus';
import { TwoFactorDisableCommand } from '../commands/two-factor-disable.command';

@Injectable({ providedIn: 'root' })
export class TwoFactorDisableFacade extends ObjectBaseFacade<
    MessageEntity,
    TwoFactorDisableDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(TwoFactorDisableBus);

    execute(dto: TwoFactorDisableDto): void {
        const command = new TwoFactorDisableCommand(dto.userId, dto.email);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui);
    }
}
