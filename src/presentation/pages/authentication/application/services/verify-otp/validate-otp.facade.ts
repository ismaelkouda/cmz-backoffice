import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { ValidateOtpRequestDto } from '@presentation/pages/authentication/application/dto/verify-otp/validate-otp-request.dto';
import { ValidateOtpBus } from '@presentation/pages/authentication/application/commands-bus/verify-otp/validate-otp.bus';
import { ValidateOtpCommand } from '@presentation/pages/authentication/application/commands/verify-otp/validate-otp.command';

@Injectable({ providedIn: 'root' })
export class ValidateOtpFacade extends ObjectBaseFacade<
    LoginResponseEntity,
    ValidateOtpRequestDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ValidateOtpBus);

    execute(dto: ValidateOtpRequestDto): void {
        const command = new ValidateOtpCommand(dto.email, dto.otp);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui);
    }
}
