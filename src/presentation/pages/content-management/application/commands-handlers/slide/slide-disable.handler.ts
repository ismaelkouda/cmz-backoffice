import { Injectable } from '@angular/core';
import { SlideDisableCommand } from '@pages/content-management/application/commands/slide/slide-disable.command';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideDisableHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(command: SlideDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
