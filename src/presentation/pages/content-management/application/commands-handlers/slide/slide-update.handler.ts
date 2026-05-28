import { Injectable, inject } from '@angular/core';
import { SlideUpdateCommand } from '@pages/content-management/application/commands/slide/slide-update.command';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideUpdateHandler {
    private readonly useCase = inject(SlideUseCase);

    execute(command: SlideUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({ ...command });
    }
}
