import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { PasswordChangeDto } from '../dto/password-change.dto';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { PasswordChangeBus } from '../commands-bus/password-change.bus';
import { PasswordChangeCommand } from '../commands/password-change.command';

@Injectable({ providedIn: 'root' })
export class PasswordChangeFacade extends ObjectBaseFacade<
    MessageEntity,
    PasswordChangeDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(PasswordChangeBus);

    execute(dto: PasswordChangeDto): void {
        const command = new PasswordChangeCommand(
            dto.oldPassword,
            dto.newPassword,
            dto.newPasswordConfirmation
        );
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui);
    }
}
