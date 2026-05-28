import { Injectable, inject } from '@angular/core';
import { SlideDeleteCommand } from '@pages/content-management/application/commands/slide/slide-delete.command';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideDeleteHandler {
    private readonly useCase = inject(SlideUseCase);

    execute(command: SlideDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
