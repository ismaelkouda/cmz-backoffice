import { Injectable, inject } from '@angular/core';
import { ResendDefineResponseEntity } from '@presentation/pages/authentication/domain/entities/resend-define/resend-define-response.entity';
import { ResendDefineRequestDto } from '@presentation/pages/authentication/application/dto/resend-define/resend-define-request.dto';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { ResendDefineRequestBus } from '@presentation/pages/authentication/application/commands-bus/resend-define/resend-define-request.bus';
import { ResendDefineRequestCommand } from '@presentation/pages/authentication/application/commands/resend-define/resend-define-request.command';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({ providedIn: 'root' })
export class ResendDefineFacade extends ObjectBaseFacade<
    ResendDefineResponseEntity,
    ResendDefineRequestDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ResendDefineRequestBus);

    execute(dto: ResendDefineRequestDto): void {
        const command = new ResendDefineRequestCommand(dto.token, dto.email);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui);
    }
}
