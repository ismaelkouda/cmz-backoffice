import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlideUnpublishCommand } from '@presentation/pages/content-management/application/commands/slide/slide-unpublish.command';
import { SlideUseCase } from '@presentation/pages/content-management/application/use-cases/slide/slide.use-case';

@Injectable({ providedIn: 'root' })
export class SlideUnpublishHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(
        command: SlideUnpublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.unpublish({
            uniqId: command.uniqId,
        });
    }
}
