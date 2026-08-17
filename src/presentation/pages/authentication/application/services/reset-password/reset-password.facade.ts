import { Injectable, inject } from '@angular/core';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { ResetPasswordRequestDto } from '@presentation/pages/authentication/application/dto/reset-password/reset-password-request.dto';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { ResetPasswordRequestBus } from '@presentation/pages/authentication/application/commands-bus/reset-password/reset-password-request.bus';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { ResetPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/reset-password/reset-password-request.command';

@Injectable({ providedIn: 'root' })
export class ResetPasswordFacade extends ObjectBaseFacade<
    ResetPasswordResponseEntity,
    ResetPasswordRequestDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ResetPasswordRequestBus);

    execute(dto: ResetPasswordRequestDto): void {
        const command = new ResetPasswordRequestCommand(
            dto.token,
            dto.email,
            dto.password,
            dto.confirmPassword
        );
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui);
    }
}
