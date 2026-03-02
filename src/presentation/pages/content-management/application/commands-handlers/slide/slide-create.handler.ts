import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlideCreateCommand } from '@presentation/pages/content-management/application/commands/slide/slide-create.command';
import { SlideUseCase } from '@presentation/pages/content-management/application/use-cases/slide/slide.use-case';

@Injectable({ providedIn: 'root' })
export class SlideCreateHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(command: SlideCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            role: command.role,
        });
    }
}
