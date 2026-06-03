import { Injectable, inject } from '@angular/core';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login-response.entity';
import { LoginRequestDto } from '@presentation/pages/authentication/application/dto/login-request.dto';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { LoginRequestBus } from '@presentation/pages/authentication/application/commands-bus/login-request.bus';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { LoginRequestCommand } from '@presentation/pages/authentication/application/commands/login-request.command';

@Injectable({ providedIn: 'root' })
export class LoginFacade extends ObjectBaseFacade<
    LoginResponseEntity,
    LoginRequestDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(LoginRequestBus);
    private readonly STALE_TIME = 2 * 60 * 1000;

    execute(dto: LoginRequestDto, force = true): void {
        const command = new LoginRequestCommand(dto.email, dto.password);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui, this.STALE_TIME, force, true);
    }
}
