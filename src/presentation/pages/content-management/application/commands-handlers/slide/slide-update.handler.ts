import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlideUpdateCommand } from '@presentation/pages/content-management/application/commands/slide/slide-update.command';
import { SlideUseCase } from '@presentation/pages/content-management/application/use-cases/slide/slide.use-case';

@Injectable({ providedIn: 'root' })
export class SlideUpdateHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(command: SlideUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            role: command.role,
        });
    }
}
