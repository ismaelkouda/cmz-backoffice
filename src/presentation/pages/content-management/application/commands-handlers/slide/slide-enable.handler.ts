import { Injectable, inject } from '@angular/core';
import { SlideEnableCommand } from '@pages/content-management/application/commands/slide/slide-enable.command';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideEnableHandler {
    private readonly useCase = inject(SlideUseCase);

    execute(command: SlideEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
