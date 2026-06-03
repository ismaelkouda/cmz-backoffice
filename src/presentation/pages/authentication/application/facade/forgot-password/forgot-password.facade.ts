import { Injectable, inject } from '@angular/core';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { ForgotPasswordRequestDto } from '@presentation/pages/authentication/application/dto/forgot-password/forgot-password-request.dto';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { ForgotPasswordRequestBus } from '@presentation/pages/authentication/application/commands-bus/forgot-password/forgot-password-request.bus';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { ForgotPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/forgot-password/forgot-password-request.command';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordFacade extends ObjectBaseFacade<
    ForgotPasswordResponseEntity,
    ForgotPasswordRequestDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ForgotPasswordRequestBus);
    private readonly STALE_TIME = 2 * 60 * 1000;

    execute(dto: ForgotPasswordRequestDto, force = true): void {
        const command = new ForgotPasswordRequestCommand(dto.email);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui, this.STALE_TIME, force, true);
    }
}
