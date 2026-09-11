import { Injectable, inject } from '@angular/core';
import { ChangePasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/change-password/change-password-response.entity';
import { ChangePasswordRequestDto } from '@presentation/pages/authentication/application/dto/change-password/change-password-request.dto';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { ChangePasswordRequestBus } from '@presentation/pages/authentication/application/commands-bus/change-password/change-password-request.bus';
import { ChangePasswordRequestCommand } from '@presentation/pages/authentication/application/commands/change-password/change-password-request.command';

@Injectable({ providedIn: 'root' })
export class ChangePasswordFacade extends ObjectBaseFacade<
    ChangePasswordResponseEntity,
    ChangePasswordRequestDto
> {
    private readonly bus = inject(ChangePasswordRequestBus);

    execute(dto: ChangePasswordRequestDto): void {
        const command = new ChangePasswordRequestCommand(
            dto.token,
            dto.password,
            dto.confirmPassword
        );
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$);
    }
}
