import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorEnableDto } from '../dto/two-factor-enable.dto';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { TwoFactorEnableBus } from '../commands-bus/two-factor-enable.bus';
import { TwoFactorEnableCommand } from '../commands/two-factor-enable.command';

@Injectable({ providedIn: 'root' })
export class TwoFactorEnableFacade extends ObjectBaseFacade<
    MessageEntity,
    TwoFactorEnableDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(TwoFactorEnableBus);
    private readonly STALE_TIME = 2 * 60 * 1000;

    execute(dto: TwoFactorEnableDto, force = true): void {
        const command = new TwoFactorEnableCommand(
            dto.userId,
            dto.email,
            dto.code
        );
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui, this.STALE_TIME, force, true);
    }
}
