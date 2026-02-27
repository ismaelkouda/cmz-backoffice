import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlidePublishCommand } from '@presentation/pages/content-management/application/commands/slide/slide-publish.command';
import { SlideUseCase } from '@presentation/pages/content-management/application/use-cases/slide/slide.use-case';

@Injectable({ providedIn: 'root' })
export class SlidePublishHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(command: SlidePublishCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.publish({
            uniqId: command.uniqId,
        });
    }
}
