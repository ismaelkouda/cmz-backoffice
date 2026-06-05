import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { ProfileUpdateDto } from '../dto/profile-update.dto';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { ProfileUpdateBus } from '../commands-bus/profile-update.bus';
import { ProfileUpdateCommand } from '../commands/profile-update.command';

@Injectable({ providedIn: 'root' })
export class ProfileUpdateFacade extends ObjectBaseFacade<
    MessageEntity,
    ProfileUpdateDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ProfileUpdateBus);
    private readonly STALE_TIME = 2 * 60 * 1000;

    execute(dto: ProfileUpdateDto, force = true): void {
        const command = new ProfileUpdateCommand(
            dto.id,
            dto.lastName,
            dto.firstName,
            dto.email,
            dto.phone
        );
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui, this.STALE_TIME, force, true);
    }
}
